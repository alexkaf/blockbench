#include <string>
#include <restclient-cpp/restclient.h>

using namespace std;

const std::string REQUEST_HEADERS = "application/json";

const std::string GET_BLOCKNUMBER =
    "{\"jsonrpc\":\"2.0\", \
      \"method\":\"eth_blockNumber\", \
      \"params\":[], \
      \"id\": 1}";

const std::string GET_ACCOUNTS = "{ \
    \"jsonrpc\": \"2.0\", \
    \"method\": \"personal_listAccounts\", \
    \"params\": [], \
    \"id\": 1 }";

const std::string UNLOCK_ACCOUNT_PREFIX =
    "{\
  \"jsonrpc\": \"2.0\", \
  \"method\": \"personal_unlockAccount\", \
  \"params\": [\"";

const std::string SEND_TX_PREFIX = 
    "{\
    \"jsonrpc\": \"2.0\", \
    \"method\": \"eth_sendTransaction\", \
    \"params\": [{ \
    \"from: \"";

const std::string SEND_TO = 
    "\", to: \"";

const std::string VALUE = 
    "\", \"value\": \"";

const std::string NONCE = 
    "\", \"nonce\": \"";

const std::string SEND_TX_SUFFIX = 
    "\"], \
    \"id\": 1 \
    }";

const std::string GET_NONCE_PREFIX = 
    "{\
    \"jsonrpc\": \"2.0\", \
    \"method\": \"eth_getTransactionCount\", \
    \"params\": [\"";

const std::string GET_NONCE_SUFFIX = 
    "\", \"latest\"], \
    \"id\": 1\
    }";

const std::string UNLOCK_ACCOUNT_SUFFIX =
    "\",\"\",null], \
      \"id\": 1}";

inline std::string send_jsonrpc_request(const std::string &endpoint,
                                        const std::string &request_header,
                                        const std::string &request_data) {
  return RestClient::post(endpoint, request_header, request_data).body;
}

inline std::string get_json_field(const std::string &json,
                                  const std::string &key) {
  auto key_pos = json.find(key);
  auto quote_sign_pos_1 = json.find('\"', key_pos + 1);
  auto quote_sign_pos_2 = json.find('\"', quote_sign_pos_1 + 1);
  auto quote_sign_pos_3 = json.find('\"', quote_sign_pos_2 + 1);
  return json.substr(quote_sign_pos_2 + 1,
                     quote_sign_pos_3 - quote_sign_pos_2 - 1);
}

inline std::string get_account_field(const std::string &json,
                                  const std::string &key) {
  auto key_pos = json.find(key);
  auto quote_sign_pos_1 = json.find('[', key_pos + 1);
  auto quote_sign_pos_2 = json.find(']', quote_sign_pos_1 + 1);

  return json.substr(quote_sign_pos_1 + 1,
                     quote_sign_pos_2 - quote_sign_pos_1 - 1);
}

inline unsigned int decode_hex(const std::string &s) {
  unsigned int ret;
  std::stringstream stm;
  stm << std::hex << s;
  stm >> ret;
  return ret;
}