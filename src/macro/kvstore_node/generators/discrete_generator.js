const { Generator } = require("./generator");
const { zipfian } = require("./zipfian_generator");
const { FVNHash64 } = require('../utils');
const assert = require('assert');

class DiscreteGenerator extends Generator {
    last_;
    sum_;
    values_ = [];

    constructor() {
        super();
        this.sum_ = 0;
    }

    AddValue(value, weight) {
        if (this.values_.length === 0) {
            this.last_ = value;
        }

        this.values_.push([value, weight]);
        this.sum_ += weight;
    }

    Next() {
        let chooser = this.randomDouble();

        for (let p of this.values_) {
            if (chooser < p[1] / this.sum_) {
                this.last_ = p[0];
                return this.last_;
            }
            chooser -= p[1] / this.sum_;
        }

        assert(false);
        return this.last_;
    }

    Last() {
        return this.last_;
    }
}

module.exports = {
    generator: DiscreteGenerator,
}