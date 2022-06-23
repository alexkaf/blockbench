const { Generator } = require("./generator");
const zipfian = require("./zipfian_generator").generator;
const { FVNHash64 } = require('../utils');


class ScrambledZipfianGenerator extends Generator {

    base_;
    num_items_;
    generator_;

    constructor(num_items_or_min, max, zipfian_const) {
        super();
        if (arguments.length === 1) {
            this.#InitSingle(num_items_or_min);
        }else {
            this.#InitMulti(num_items_or_min, max, zipfian_const);
        }
    }

    #InitSingle(num_items) {
        this.#InitMulti(0, num_items - 1);
    }

    #InitMulti(min, max,
               zipfian_const = zipfian.kMaxNumItems) {
        this.base_ = min;
        this.num_items_ = max - min + 1;
        this.generator_ = new zipfian(min, max, zipfian_const);
    }

    Next() {
        let value = this.generator_.Next();
        value = this.base_ + FVNHash64(value) % this.num_items_;
        this.last_ = value;

        return this.last_;
    }

    Last() {
        return this.last_;
    }
}

module.exports = {
    generator: ScrambledZipfianGenerator,
}