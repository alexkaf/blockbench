const {
    Connection,
} = require('@solana/web3.js');
const utils = require('./utils');

class SolanaDB {
    kOK = 0;
    connection;
    endpoint_;
    from_address_;
    program_id_;
    contract = 'smallbank';
    pending_tx_;

    constructor(endpoint) {
        this.endpoint_ = endpoint;
        this.connection = new Connection(this.endpoint_);
    }

    async Init(pending_tx) {
        this.from_address_ = await utils.get_from_address(this.connection);
        this.program_id_ = utils.deploy_smart_contract(this.contract);
        this.pending_tx_ = pending_tx;
    }

    async getTip() {
        return await utils.get_tip_block_number(this.connection);
    }

    async Almagate(acc1, acc2) {
        const start_time = Date.now();
        const txId = await utils.submit_almagate_txn(this.connection, this.from_address_, {
            arg0: acc1,
            arg1: acc2,
        }, this.program_id_);

        await this.connection.confirmTransaction(txId, "confirmed")
            .then((data) => {
                let end_time = Date.now();
                this.pending_tx_[txId] = {
                    start_time: start_time,
                    end_time: end_time,
                    hash: txId,
                    block: data.context.slot,
                };
            });

        return this.kOK;

    }

    async GetBalance(acc,) {
        const start_time = Date.now();
        const txId = await utils.submit_getBalance_txn(this.connection, this.from_address_, {
            arg0: acc,
        }, this.program_id_);

        await this.connection.confirmTransaction(txId, "confirmed")
            .then((data) => {
                let end_time = Date.now();
                this.pending_tx_[txId] = {
                    start_time: start_time,
                    end_time: end_time,
                    hash: txId,
                    block: data.context.slot,
                };
            });

        return this.kOK;
    }

    async UpdateBalance(acc, amount) {
        const start_time = Date.now();
        const txId = await utils.submit_updateBalance_txn(this.connection, this.from_address_, {
            arg0: acc,
            arg1: amount,
        }, this.program_id_);

        await this.connection.confirmTransaction(txId, "confirmed")
            .then((data) => {
                let end_time = Date.now();
                this.pending_tx_[txId] = {
                    start_time: start_time,
                    end_time: end_time,
                    hash: txId,
                    block: data.context.slot,
                };
            });

        return this.kOK;
    }

    async UpdateSaving(acc, amount) {
        const start_time = Date.now();
        const txId = await utils.submit_updateSaving_txn(this.connection, this.from_address_, {
            arg0: acc,
            arg1: amount,
        }, this.program_id_);

        await this.connection.confirmTransaction(txId, "confirmed")
            .then((data) => {
                let end_time = Date.now();
                this.pending_tx_[txId] = {
                    start_time: start_time,
                    end_time: end_time,
                    hash: txId,
                    block: data.context.slot,
                };
            });

        return this.kOK;
    }

    async SendPayment(acc1, acc2, amount) {
        const start_time = Date.now();
        const txId = await utils.submit_sendPayment_txn(this.connection, this.from_address_, {
            arg0: acc1,
            arg1: acc2,
            arg2: amount,
        }, this.program_id_);

        await this.connection.confirmTransaction(txId, "confirmed")
            .then((data) => {
                let end_time = Date.now();
                this.pending_tx_[txId] = {
                    start_time: start_time,
                    end_time: end_time,
                    hash: txId,
                    block: data.context.slot,
                };
            });

        return this.kOK;
    }


    async WriteCheck(acc, amount) {
        const start_time = Date.now();
        const txId = await utils.submit_writeCheck_txn(this.connection, this.from_address_, {
            arg0: acc,
            arg1: amount,
        }, this.program_id_);

        await this.connection.confirmTransaction(txId, "confirmed")
            .then((data) => {
                let end_time = Date.now();
                this.pending_tx_[txId] = {
                    start_time: start_time,
                    end_time: end_time,
                    hash: txId,
                    block: data.context.slot,
                };
            });
        return this.kOK;
    }

    async add_to_que(json) {

    }

    async PollTxn(slot_number) {
        return await utils.poll_txs_by_block_number(this.connection, slot_number);
    }
}

module.exports = {
    SolanaDB: SolanaDB,
}