const { Generator } = require('./generator');
const utils = require('./utils');
const {
    ZipfianGenerator,
    kZipfianConst,
} = require('./zipfian_generator');

class ScrambledZipfianGenerator extends Generator {
    base_;
    num_items_;
    generator_;
    last_;

    constructor(num_items_or_min, max, zipfian_const = kZipfianConst) {
        super();
        if (arguments.length === 1) {
            this.#ScrambledZipfianGeneratorSingle(num_items_or_min);
        } else {
            this.#ScrambledZipfianGeneratorMulti(num_items_or_min, max, zipfian_const);
        }
    }

    #ScrambledZipfianGeneratorSingle(num_items) {
        return this.#ScrambledZipfianGeneratorMulti(0, num_items - 1);
    }

    #ScrambledZipfianGeneratorMulti(min, max, zipfian_const = kZipfianConst) {
        this.base_ = min;
        this.num_items_ = max - min + 1;
        this.generator_ = new ZipfianGenerator(min, max, zipfian_const);
    }

    Next() {
        let value = this.generator_.Next();
        this.last_ = this.base_ + utils.FVNHash64(value) % this.num_items_;
        return this.last_;
    }

    Last() {
        return this.last_;
    }

}

module.exports = {
    ScrambledZipfianGenerator: ScrambledZipfianGenerator
}