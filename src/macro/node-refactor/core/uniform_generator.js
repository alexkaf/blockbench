const { Generator } = require('./generator');

class UniformGenerator extends Generator {
    last_int_;
    min;
    max;

    constructor(min, max) {
        super();
        this.min = min;
        this.max = max;
    }

    Next() {
        this.last_int_ = Math.floor(Math.random() * (this.max - this.min)) + this.min;
        return this.last_int_;
    }

    Last() {
        return this.last_int_;
    }
}

module.exports = {
    UniformGenerator: UniformGenerator
}