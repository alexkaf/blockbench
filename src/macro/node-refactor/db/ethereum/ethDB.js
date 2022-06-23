const Web3 = require('web3');
const utils = require('./utils');
const DB = require('../../core/db').DB;

class EthDB extends DB{
    connection;
    endpoint_;
    from_address_;
    program_id_;
    deploy_wait_;
    contract;
    contractObject;
    pending_tx_;

    constructor(endpoint, wl_name, deploy_wait) {
        super();
        this.endpoint_ = endpoint;
        switch (wl_name) {
            case 'ycsb': {
                this.contract = 'kvstore';
                break;
            }
            default: {
                this.contract = 'donothing';
                break;
            }
        }
        this.connection = new Web3(this.endpoint_);
        this.deploy_wait_ = deploy_wait;
    }

    async Init(pending_tx) {
        this.from_address_ = await utils.get_from_address(this.connection);
        const deployed = await utils.deploy_smart_contract(this.connection, this.from_address_, this.contract);
        this.program_id_ = deployed.programId;
        this.contractObject = deployed.contractObject;
        this.pending_tx_ = pending_tx;
    }

    async getTip() {
        return await utils.get_tip_block_number(this.connection);
    }

    async Read(table, key, fields, result) {
        let txId;
        const start_time = Date.now();
        if (this.contract === 'donothing') {
            txId = await utils.submit_do_nothing_txn(this.contractObject,);
        } else {
            txId = await utils.submit_get_txn(this.contractObject, key,);
        }
        const end_time = Date.now();

        this.pending_tx_[`${key} | ${txId}`] = {
            start_time: start_time,
            end_time: end_time,
        };

        return this.kOK;
    }

    async Update(table, key, values) {
        let txId;
        let val = '';
        for (let v of values) {
            val += `${v[0]} = ${v[1]} `;
        }

        const start_time = Date.now();
        if (this.contract === 'donothing') {
            txId = await utils.submit_do_nothing_txn(this.contractObject,);
        } else {
            txId = await utils.submit_set_txn(this.contractObject, key, val);
        }
        const end_time = Date.now();

        this.pending_tx_[txId.transactionHash] = {
            block: txId.blockNumber,
            start_time: start_time,
            end_time: end_time,
            hash: txId.transactionHash,
        };

        return this.kOK;
    }

    async Insert(table, key, values) {
        return await this.Update(table, key, values);
    }

    async Delete(table, key) {
        return await this.Update(table, key, [""]);
    }

    async PollTxn(blockNumber) {
        return await utils.poll_txs_by_block_number(this.connection, blockNumber);
    }
}


module.exports = {
    EthereumDB: EthDB,
}