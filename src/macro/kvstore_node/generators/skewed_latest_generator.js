const { Generator } = require("./generator");
const { zipfian } = require("./zipfian_generator");

class SkewedLatestGenerator extends Generator {
    basis_;
    zipfian_;
    last_;

    constructor(counter) {
        super();
        this.basis_ = counter;
        this.zipfian_ =
            new zipfian(this.basis_.Last());

        this.Next();
    }

    Next() {
        const max = this.basis_.Last();
        this.last_ = max - this.zipfian_.Next(max);
        return this.last_;
    }

    Last() {
        return this.last_;
    }
}

module.exports = {
    generator: SkewedLatestGenerator,
}