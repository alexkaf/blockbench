const {
    Connection,
} = require('@solana/web3.js');
const utils = require('./utils');
const DB = require('../../core/db').DB;

class SolanaDB extends DB{
    connection;
    endpoint_;
    from_address_;
    program_id_;
    deploy_wait_;
    contract;
    pending_tx_;
    poll_txn_by_hash_;

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
        this.connection = new Connection(this.endpoint_);
        this.deploy_wait_ = deploy_wait;
    }

    async Init(pending_tx) {
        this.from_address_ = await utils.get_from_address(this.connection);
        this.program_id_ = utils.deploy_smart_contract(this.contract);
        this.pending_tx_ = pending_tx;
    }

    async getTip() {
        return await utils.get_tip_block_number(this.connection);
    }

    async Read(table, key, fields, result) {
        let txId;
        const start_time = new Date();
        if (this.contract === 'donothing') {
            txId = await utils.submit_do_nothing_txn(this.connection, this.from_address_, this.program_id_);
        } else {
            txId = await utils.submit_get_txn(this.connection, this.from_address_, this.program_id_, {
                key: key
            });
        }
        // this.pending_tx_[txId.hash] = txId;
        // this.pending_tx_[txId.hash]['block'] = 1;
        this.pending_tx_[txId.hash] = {
            start_time: txId.start_time
        };
        // await this.connection.confirmTransaction(txId, "confirmed");
        // let end_time = Date.now();
        // this.pending_tx_[txId] = {
        //     start_time: start_time,
        //     end_time: new Date(),
        //     hash: 1,
        //     block: 1,
        // };
        return this.kOK;
    }

    async Update(table, key, values) {
        let txId;
        let val = '';
        for (let v of values) {
            val += `${v[0]} = ${v[1]} `;
        }

        const start_time = new Date();
        if (this.contract === 'donothing') {
            txId = await utils.submit_do_nothing_txn(this.connection, this.from_address_, this.program_id_);
        } else {
            txId = await utils.submit_set_txn(this.connection, this.from_address_, this.program_id_, {
                key: key,
                value: val,
            },);
        }
        // console.log(txId);
        // this.pending_tx_[txId.hash] = txId;
        this.pending_tx_[txId.hash] = {
            start_time: txId.start_time
        };
        // await this.connection.confirmTransaction(txId, "confirmed");
        // let end_time = new Date();
        // this.pending_tx_[txId] = {
        //     start_time: start_time,
        //     end_time: end_time,
        //     hash: 1,
        //     block: 1,
        // };
        return this.kOK;
    }

    async Insert(table, key, values) {
        return await this.Update(table, key, values);
    }

    async Delete(table, key) {
        return await this.Update(table, key, [""]);
    }

    async PollTxn(slot_number) {
        return await utils.poll_txs_by_block_number(this.connection, slot_number);
    }
}


// (async () => {
//     let pending_tx = {};
//     const obj = new SolanaDB('http://localhost:8899/', 'kvstore', 20);
//     await obj.Init(pending_tx);
//     await obj.Update('alex', 'alex', [['ena', 'dio'], ['tria', 'tessera'], ['pente', 'eksi']]);
//
// })();

module.exports = {
    SolanaDB: SolanaDB,
}