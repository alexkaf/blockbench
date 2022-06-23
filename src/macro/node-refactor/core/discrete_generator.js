const { Generator } = require('./generator');
const utils = require('./utils');

class DiscreteGenerator extends Generator {
    sum_;
    last_;
    values_ = [];

    constructor() {
        super();
        this.sum_ = 0;
    }

    Next() {
        let chooser = utils.RandomDouble();

        for (let p of this.values_) {
            if (chooser < p[1] / this.sum_) {
                this.last_ = p[0];
                return this.last_;
            }
            chooser -= p[1] / this.sum_;
        }
        return this.last_;
    }

    Last() {
        return this.last_;
    }

    AddValue(value, weight) {
        if (this.values_.length === 0) {
            this.last_ = value;
        }

        this.values_.push([value, weight]);
        this.sum_ += weight;
    }
}

module.exports = {
    DiscreteGenerator: DiscreteGenerator,
}