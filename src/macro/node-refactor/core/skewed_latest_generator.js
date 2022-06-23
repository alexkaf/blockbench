const { ZipfianGenerator } = require('./zipfian_generator');
const { Generator } = require('./generator');

class SkewedLatestGenerator extends Generator {
    basis_;  // CounterGenerator
    zipfian_;
    last_;

    constructor(counter) {
        super();
        this.basis_ = counter;
        this.zipfian_ = new ZipfianGenerator(this.basis_.Last());

        this.Next();
    }

    Next() {
        const max = this.basis_.Last();
        this.last_ = max - this.zipfian_.Next();
        return this.Last();
    }

    Last() {
        return this.last_;
    }
}

module.exports = {
    SkewedLatestGenerator: SkewedLatestGenerator,
}