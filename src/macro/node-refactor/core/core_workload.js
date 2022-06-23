const { Generator } = require('./generator');
const { DiscreteGenerator } = require('./discrete_generator');
const { CounterGenerator } = require('./counter_generator');
const { ConstGenerator } = require("./const_generator");
const { ZipfianGenerator } = require("./zipfian_generator");
const { UniformGenerator } = require("./uniform_generator");
const { ScrambledZipfianGenerator } = require("./scrambled_zipfian_generator");
const utils = require('./utils');
const { DB } = require('./db');
const {SkewedLatestGenerator} = require("./skewed_latest_generator");


class CoreWorkload {
    table_name_;
    field_count_;
    read_all_fields_;
    write_all_fields_;
    field_len_generator_;
    key_generator_;
    op_chooser_ = new DiscreteGenerator();
    key_chooser_;
    field_chooser_;
    scan_len_chooser_;
    insert_key_sequence_;
    ordered_inserts_;
    record_count_;

    constructor() {
        this.field_count_ = 0;
        this.read_all_fields_ = false;
        this.write_all_fields_ = false;
        this.insert_key_sequence_ = new CounterGenerator(3);
        this.ordered_inserts_ = true;
        this.record_count_ = 0;
    }

    Init(p) {
        this.table_name_ = p.GetProperty('table', 'usertable');
        this.field_count_ = p.GetProperty('fieldcount', 10);
        this.field_len_generator_ = this.GetFieldGenerator(p);

        const read_proportion = p.GetProperty('readproportion', 0.95);
        const update_proportion = p.GetProperty('updateproportion', 0.05);
        const insert_proportion = p.GetProperty('insertproportion', 0.0);
        const scan_proportion = p.GetProperty('scanproportion', 0.0);
        const readmodifywrite_proportion = p.GetProperty('readmodifywriteproportion', 0.0);

        this.record_count_ = p.GetProperty('recordcount');
        const request_dist = p.GetProperty('requestdistribution', 'uniform');

        const max_scan_len = p.GetProperty('maxscanlength', 1000);
        const scan_len_dist = p.GetProperty('scanlengthdistribution', 'uniform');
        const insert_start = p.GetProperty('insertstart', 0);

        this.read_all_fields_ = p.GetProperty('readallfields', true);
        this.write_all_fields_ = p.GetProperty('writeallfields', false);

        this.ordered_inserts_ = p.GetProperty('insertorder', 'hashed') !== 'hashed';

        this.key_generator_ = new CounterGenerator(insert_start);

        if (read_proportion > 0) this.op_chooser_.AddValue('READ', read_proportion);
        if (update_proportion > 0) this.op_chooser_.AddValue('UPDATE', update_proportion);
        if (insert_proportion > 0) this.op_chooser_.AddValue('INSERT', insert_proportion);
        if (scan_proportion > 0) this.op_chooser_.AddValue('SCAN', scan_proportion);
        if (readmodifywrite_proportion > 0) this.op_chooser_.AddValue('READMODIFYWRITE', readmodifywrite_proportion);

        this.insert_key_sequence_.Set(this.record_count_);

        switch (request_dist) {
            case 'uniform': {
                this.key_chooser_ = new UniformGenerator(0, this.record_count_ - 1);
                break;
            }
            case 'zipfian': {
                const op_count = p.GetProperty('operationcount');
                const new_keys = Math.floor(op_count * insert_proportion * 2);
                this.key_chooser_ = new ScrambledZipfianGenerator(this.record_count_ + new_keys);
                break;
            }
            case 'latest': {
                this.key_chooser_ = new SkewedLatestGenerator(this.insert_key_sequence_);
                break;
            }
            default: {
                throw `Unknown request distribution: ${request_dist}`;
            }
        }

        this.field_chooser_ = new UniformGenerator(0, this.field_count_ - 1);

        switch (scan_len_dist) {
            case 'uniform': {
                this.scan_len_chooser_ = new UniformGenerator(1, max_scan_len);
                break;
            }
            case 'zipfian': {
                this.scan_len_chooser_ = new ZipfianGenerator(1, max_scan_len);
                break;
            }
            default: {
                throw `Distribution not allowed for scan length: ${scan_len_dist}`;
            }
        }

    }

    BuildValues(values) {
        for (let i = 0; i < this.field_count_; i += 1){
            values.push([
                `field${i}`,
                `${this.field_len_generator_.Next(), utils.RandomPrintChar()}`
            ]);
        }
    }

    BuildUpdate(update) {
        update.push([
            this.NextFieldName(),
            `${this.field_len_generator_.Next()}${utils.RandomPrintChar()}`
        ]);
    };

    GetFieldGenerator(p){
        const field_len_dist = p.GetProperty('field_len_dist', 'constant');
        const field_len = p.GetProperty('fieldlength', 100);

        switch (field_len_dist) {
            case 'constant': {
                return new ConstGenerator(field_len);
            }
            case 'uniform': {
                return new UniformGenerator(1, field_len);
            }
            case 'zipfian': {
                return new ZipfianGenerator(1, field_len);
            }
            default: {
                throw `Unknown field length distribution ${field_len_dist}`;
            }
        }
    }
    NextTable(){
        return this.table_name_;
    }

    NextSequenceKey() {
        const key_num = this.key_generator_.Next();
        return this.BuildKeyName(key_num);
    }

    BuildKeyName(key_num) {
        if (!this.ordered_inserts_) {
            key_num = utils.Hash(key_num);
        }
        return `user${key_num}`;
    }

    NextTransactionKey() {
        let key_num;
        do {
            key_num = this.key_chooser_.Next();
        } while (key_num > this.insert_key_sequence_.Last());
        return this.BuildKeyName(key_num);
    }

    NextOperation() {
        return this.op_chooser_.Next();
    }

    NextFieldName() {
        return `field${this.field_chooser_.Next()}`;
    }

    NextScanLength() {
        return this.scan_len_chooser_.Next();
    }

    read_all_fields() {
        return this.read_all_fields_;
    }

    write_all_fields() {
        return this.write_all_fields;
    }

}

module.exports = {
    CoreWorkload: CoreWorkload,
}