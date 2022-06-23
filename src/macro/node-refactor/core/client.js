const { DB } = require('./db');
const { CoreWorkload } = require('./core_workload');
const utils = require('./utils');
const assert = require('assert');

const checkOk = (result) => {
    return (result === DB.kOK);
}

class Client {
    db_;
    workload_;

    constructor(db, wl) {
        this.db_ = db;
        this.workload_ = wl;
    }

    async DoInsert() {
        const key = this.workload_.NextSequenceKey();
        let pairs = [];
        this.workload_.BuildValues(pairs);
        return await this.db_.Insert(this.workload_.NextTable(), key, pairs).then((res) => {
            return (res === this.db_.kOK);
        });
    }

    async DoTransaction() {
        let status = -1;
        switch (this.workload_.NextOperation()) {
            case 'READ': {
                return await this.TransactionRead().then((status) => {
                    assert(status >= 0);
                    return (status === DB.kOK);
                });
            }
            case 'UPDATE': {
                return await this.TransactionUpdate().then((status) => {
                    assert(status >= 0);
                    return (status === DB.kOK);
                });
            }
            case 'INSERT': {
                return await this.TransactionInsert().then((status) => {
                    assert(status >= 0);
                    return (status === DB.kOK);
                });
            }
            case 'SCAN': {
                return await this.TransactionScan().then((status) => {
                    assert(status >= 0);
                    return (status === DB.kOK);
                });
            }
            case 'READMODIFYWRITE': {
                return await this.TransactionReadModifyWrite().then((status) => {
                    assert(status >= 0);
                    return (status === DB.kOK);
                });
            }
            default: {
                throw `Operation request is not recognized!`;
            }
        }
    }

    async TransactionRead() {
        const table = this.workload_.NextTable();
        const key = this.workload_.NextTransactionKey();
        let result = [];

        if (!this.workload_.read_all_fields()) {
            let fields = [];
            fields.push(`field${this.workload_.NextFieldName()}`);
            return await this.db_.Read(table, key, fields, result);
        } else {
            return await this.db_.Read(table, key, undefined, result);
        }
    }

    async TransactionReadModifyWrite() {
        const table = this.workload_.NextTable();
        const key = this.workload_.NextTransactionKey();
        let result = [];

        if (!this.workload_.read_all_fields()) {
            let fields = [];
            fields.push(`field${this.workload_.NextFieldName()}`);
            await this.db_.Read(table, key, fields, result);
        } else {
            await this.db_.Read(table, key, undefined, result);
        }

        let values = [];
        if (this.workload_.write_all_fields()) {
            this.workload_.BuildValues(values);
        } else {
            this.workload_.BuildUpdate(values);
        }

        return await this.db_.Update(table, key, values);
    }

    async TransactionScan() {
        const table = this.workload_.NextTable();
        const key = this.workload_.NextTransactionKey();
        let len = this.workload_.NextScanLength();

        let result = [];

        if (!this.workload_.read_all_fields()) {
            let fields = [];
            fields.push(`field${this.workload_.NextFieldName()}`);
            return await this.db_.Scan(table, key, len, fields, result);
        } else {
            return await this.db_.Scan(table, key, len, undefined, result);
        }
    }

    async TransactionUpdate() {
        const table = this.workload_.NextTable();
        const key = this.workload_.NextTransactionKey();
        let values = [];

        if (this.workload_.write_all_fields()) {
            this.workload_.BuildValues(values);
        } else {
            this.workload_.BuildUpdate(values);
        }

        return await this.db_.Update(table, key, values);
    }

    async TransactionInsert() {
        const table = this.workload_.NextTable();
        const key = this.workload_.NextTransactionKey();
        let values = [];

        this.workload_.BuildValues(values);
        return await this.db_.Insert(table, key, values);
    }
}

module.exports = {
    Client: Client,
}