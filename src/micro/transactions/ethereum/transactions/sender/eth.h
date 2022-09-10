#include <vector>
#include <random>
#include <string>
#include "requests.h"
#include "utils.h"

struct Transaction {
    std::string from;
    std::string to;
    std::string value;
    std::string nonce;
};

class UniformRandomInt {

    std::random_device _rd{};
    std::mt19937 _gen{_rd()};
    std::uniform_int_distribution<int> _dist;

    public:

        UniformRandomInt() {
            set(1, 10);
        }
        UniformRandomInt(int low, int high) {
            set(low, high);
        }

        // Set the distribution parameters low and high.
        void set(int low, int high) {
            std::uniform_int_distribution<int>::param_type param(low, high);
            _dist.param(param);
        }

        // Get random integer.
        int get() {
            return _dist(_gen);
        }

};

class Eth {
    public:
        Eth(std::string endpoint, SpinLock *nonceLock, SpinLock *txlock, std::unordered_map<string, double> *pendingtx): 
        endpoint("http://" + endpoint + ":8545"), nonceLock_(nonceLock), txlock_(txlock), pendingtx_(pendingtx)
        {
            tip = get_tip_block_number();
            collect_accounts();
            
            int totalNumberOfAccounts = accounts_.size();
            
            dist_.set(0,totalNumberOfAccounts - 1);
        };

        std::string endpoint;
        int tip;

        int get_tip_block_number() {
          auto r = send_jsonrpc_request(endpoint, REQUEST_HEADERS, GET_BLOCKNUMBER);
          if (r.find("Failed") != std::string::npos) 
            return -1;

          return decode_hex(get_json_field(
              send_jsonrpc_request(endpoint, REQUEST_HEADERS, GET_BLOCKNUMBER),
              "result"));
        }

        void collect_accounts() {
            auto r = send_jsonrpc_request(endpoint, REQUEST_HEADERS, GET_ACCOUNTS);
            auto field = get_account_field(r, "result");
            fill_accounts(field);
        }

        Transaction create_transaction() {
            Transaction tx; 
            std::string fromAccount, toAccount;
            
            tx.from = getFromAccount();
            tx.to = getToAccount(fromAccount);
            tx.value = "0x3e8";

            nonceLock_->lock();
            tx.nonce = "0x" + dec_to_hex(account_nonces_[tx.from]++);
            nonceLock_->unlock();
            return tx;
        }

        void send_transaction() {
            Transaction tx = create_transaction();

            std::string req = send_tx_request(&tx);
            
            std::string resp = send_jsonrpc_request(endpoint, REQUEST_HEADERS, req);
            // std::cout << resp << std::endl;
            std::string hash = get_json_field(
                resp,
                "result"
            );

            txlock_->lock();
            (*pendingtx_)[hash] = utils::time_now();
            txlock_->unlock();
        }

        int getBlockTransactionCount(int blockNumber) {
            std::string request = GET_BLOCK_TX_COUNT_PREFIX + "0x" + dec_to_hex(blockNumber) + GET_BLOCK_TX_COUNT_SUFFIX;
            return decode_hex(
                        get_json_field(
                            send_jsonrpc_request(endpoint, REQUEST_HEADERS, request),
                            "result"
                            )
                        );
        }

        std::vector<std::string> poll_txs_by_block_number(int block_number) {
            std::string request = GET_BLOCK_BY_NUMBER_PREFIX +
                                    ("0x" + dec_to_hex(block_number)) +
                                    GET_BLOCK_BY_NUMBER_SUFFIX;
            auto r = send_jsonrpc_request(endpoint, REQUEST_HEADERS, request);

            std::vector<std::string> ret = get_list_field(r, "transactions");
            std::vector<std::string> uncles = get_list_field(r, "uncles");
            for (std::string uncle : uncles) {
                std::vector<std::string> uncletxs = poll_txs_by_block_hash(endpoint, uncle);
                for (std::string tx : uncletxs) ret.push_back(tx);
            }
            return ret;
            }

    private:
        void unlock_address(const std::string &address) {
            send_jsonrpc_request(endpoint, REQUEST_HEADERS,
                                UNLOCK_ACCOUNT_PREFIX + address + UNLOCK_ACCOUNT_SUFFIX);
        }

        void fill_accounts(const std::string &accounts) {
            auto address_pos = accounts.find('\"');

            while (1) {
                auto next_addr_idx = accounts.find('\"', address_pos + 1);
                auto next_addr = accounts.substr(address_pos + 1, next_addr_idx - address_pos - 1);

                int nonce = decode_hex(
                                get_json_field(
                                    send_jsonrpc_request(endpoint, REQUEST_HEADERS, nonce_request(next_addr)),
                                    "result"
                                )
                            );
                account_nonces_[next_addr] = nonce;
                accounts_.push_back(next_addr);
                
                address_pos = accounts.find('\"', next_addr_idx + 1);
                if (address_pos == std::string::npos) {
                    break;
                }
            }
        }

        std::string nonce_request(const std::string account) {
            return GET_NONCE_PREFIX + account + GET_NONCE_SUFFIX;
        }

        std::string send_tx_request(Transaction *tx) {
            return SEND_TX_PREFIX + tx->from + SEND_TO + tx->to + VALUE + tx->value + NONCE + tx->nonce + SEND_TX_SUFFIX;
        }

        std::string getFromAccount(void)  {
            int idx = dist_.get();
            return accounts_[idx];
        }

        std::string getToAccount(std::string fromAccount)  {
            int idx;
            while (1) {
                idx = dist_.get();
                std::string toAccount = accounts_[idx];

                if (fromAccount.compare(toAccount) < 0) {
                    return toAccount;
                }
            }
        }

        std::unordered_map<string, int> account_nonces_;
        UniformRandomInt dist_;
        vector<Transaction> txs_;
        vector<string> accounts_;
        SpinLock *nonceLock_;
        SpinLock *txlock_;
        std::unordered_map<string, double> *pendingtx_;
};