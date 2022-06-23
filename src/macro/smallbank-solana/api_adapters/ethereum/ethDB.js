const Web3 = require('web3');
const utils = require('./utils');

class EthDB{
    kOK = 0;
    connection;
    endpoint_;
    from_address_;
    program_id_;
    contract = 'smallbank';
    contractObject;
    pending_tx_;

    constructor(endpoint) {
        this.endpoint_ = endpoint;
        this.connection = new Web3(this.endpoint_);
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

    async Almagate(acc1, acc2) {
        const start_time = Date.now();
        const txId = await utils.submit_almagate_txn(this.contractObject, acc1, acc2);

        const end_time = Date.now();

        this.pending_tx_[txId.transactionHash] = {
            block: txId.blockNumber,
            start_time: start_time,
            end_time: end_time,
            hash: txId.transactionHash,
        };

        return this.kOK;

    }

    async GetBalance(acc,) {
        const start_time = Date.now();
        const txId = await utils.submit_getBalance_txn(this.contractObject, acc);

        const end_time = Date.now();

        this.pending_tx_[txId.transactionHash] = {
            block: txId.blockNumber,
            start_time: start_time,
            end_time: end_time,
            hash: txId.transactionHash,
        };

        return this.kOK;
    }

    async UpdateBalance(acc, amount) {
        const start_time = Date.now();
        const txId = await utils.submit_updateBalance_txn(this.contractObject, acc, amount);

        const end_time = Date.now();

        this.pending_tx_[txId.transactionHash] = {
            block: txId.blockNumber,
            start_time: start_time,
            end_time: end_time,
            hash: txId.transactionHash,
        };

        return this.kOK;
    }

    async UpdateSaving(acc, amount) {
        const start_time = Date.now();
        const txId = await utils.submit_updateSaving_txn(this.contractObject, acc, amount);

        const end_time = Date.now();

        this.pending_tx_[txId.transactionHash] = {
            block: txId.blockNumber,
            start_time: start_time,
            end_time: end_time,
            hash: txId.transactionHash,
        };

        return this.kOK;
    }

    async SendPayment(acc1, acc2, amount) {
        const start_time = Date.now();
        const txId = await utils.submit_sendPayment_txn(this.contractObject, acc1, acc2, amount);

        const end_time = Date.now();

        this.pending_tx_[txId.transactionHash] = {
            block: txId.blockNumber,
            start_time: start_time,
            end_time: end_time,
            hash: txId.transactionHash,
        };

        return this.kOK;
    }


    async WriteCheck(acc, amount) {
        const start_time = Date.now();
        const txId = await utils.submit_writeCheck_txn(this.contractObject, acc, amount);

        const end_time = Date.now();

        this.pending_tx_[txId.transactionHash] = {
            block: txId.blockNumber,
            start_time: start_time,
            end_time: end_time,
            hash: txId.transactionHash,
        };

        return this.kOK;
    }

    async add_to_que(json) {

    }

    async PollTxn(slot_number) {
        return await utils.poll_txs_by_block_number(this.connection, slot_number);
    }
}

// (async () => {
//     let pending_tx = {};
//     const obj = new EthDB('http://localhost:8545/');
//     await obj.Init(pending_tx);
//     await obj.WriteCheck('alex', 100);
//     await obj.Almagate('alex', 'nick');
//     await obj.UpdateBalance('alex', 100);
//     await obj.UpdateSaving('alex', 100);
//     console.log(pending_tx)
// })();

module.exports = {
    EthereumDB: EthDB,
}