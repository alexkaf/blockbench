const utils = require('../utils');
const generator = require('../generators/generators');
const defaults = require('./defaults');
const {ConstantGenerator, UniformGenerator, ZipfianGenerator, CounterGenerator, ScrambledZipfianGenerator,
    SkewedZipfianGenerator, DiscreteGenerator
} = require("../generators/generators");



class CoreWorkload {
    field_count_ = 0;
    read_all_fields_ = false;
    write_all_fields_ = false;
    field_len_generator_ = undefined;
    key_generator_ = undefined;
    key_chooser_ = undefined;
    field_chooser_ = undefined;
    scan_len_chooser_ = undefined;
    insert_key_sequence_;
    ordered_inserts_ = true;
    record_count_ = 0;

    op_chooser_ = new DiscreteGenerator();
    constructor (){
        this.insert_key_sequence_ = new CounterGenerator(3);
    }

    Init(properties) {
        this.table_name_ = properties.GetProperty('table', 'usertable');
        this.field_count_ = properties.GetProperty('fieldcount', 10);
        this.field_len_generator_ = this.GetFieldLenGenerator(properties);

        const read_proportion = properties.GetProperty('readproportion', 0.95);
        const update_proportion = properties.GetProperty('updateproportion', 0.05);
        const insert_proportion = properties.GetProperty('insertproportion', 0.0);
        const scan_proportion = properties.GetProperty('scanproportion', 0.0);
        const readmodifywrite_proportion = properties.GetProperty('readmodifywriteproportion', 0.0);

        this.record_count_ = properties.GetProperty('recordcount', 'operationcount');
        const request_dist = properties.GetProperty('requestdistribution', 'uniform');
        const max_scan_len = properties.GetProperty('maxscanlength', 1000);
        const scan_len_dist = properties.GetProperty('scanlengthdistribution', 'uniform');
        const insert_start = properties.GetProperty('insertstart', 0);

        this.read_all_fields_ = properties.GetProperty('readallfields', true);
        this.write_all_fields_ = properties.GetProperty('writeallfields', false);

        this.ordered_inserts_ = properties.GetProperty('insertorder', 'hashed') !== 'hashed';

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
                const op_count = properties.GetProperty('operationcount');
                const new_keys = Math.floor(op_count * insert_proportion * 2);
                this.key_chooser_ = new ScrambledZipfianGenerator(this.record_count_ + new_keys);
                break;
            }
            case 'latest': {
                this.key_chooser_ = new SkewedZipfianGenerator(this.insert_key_sequence_);
                break;
            }
            default: {
                throw `Unknown distribution ${request_dist}`
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
                throw `Not allowed distribution: ${scan_len_dist}`;
            }
        }
    }

    NextTable() {
        return this.table_name_;
    }

    NextOperation() {
        return this.op_chooser_.Next();
    }

    NextScanLength() {
        return this.scan_len_chooser_.Next();
    }

    read_all_fields() {
        return this.read_all_fields_;
    }

    write_all_fields() {
        return this.write_all_fields_;
    }

    NextSequenceKey() {
        const key_num = this.key_generator_.Next();
        return this.BuildKeyName(key_num);
    }

    NextTransactionKey() {
        let key_num;
        do {
            key_num = this.key_chooser_.Next();
        } while(key_num > this.insert_key_sequence_.Last());
        return this.BuildKeyName(key_num);
    }

    BuildKeyName(key_num) {
        if (!this.ordered_inserts_) {
            key_num = utils.Hash(key_num);
        }
        return `user${key_num}`;
    }

    NextFieldName() {
        return `field${this.field_chooser_.Next()}`;
    }

    BuildValues() {
        let values = [];
        for (let i=0; i < this.field_count_; i += 1) {
            values.push([`field${i}`,
                `${this.field_len_generator_.Next()}${utils.RandomPrintChar()}`]);
        }
        return values;
    }

    BuildUpdate(update) {
        update.push(
            [this.field_len_generator_.Next(),
            utils.RandomPrintChar,]
        );
        return update;
    }

    GetFieldLenGenerator(properties) {
        const field_len_dist = properties.GetProperty('field_len_dist', 'constant');
        const field_len = properties.GetProperty('fieldlength', 100);

        switch (field_len_dist) {
            case 'constant': {
                return new ConstantGenerator(field_len);
            }
            case 'uniform': {
                return new UniformGenerator(1, field_len);
            }
            case 'zipfian': {
                return new ZipfianGenerator(1, field_len);
            }
            default : {
                throw `Unknown generator: ${field_len_dist}`
            }
        }
    }
}

module.exports = {
    Workload: CoreWorkload,
}