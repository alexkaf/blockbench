
class Generator {

}

class UniformGenerator extends Generator {
    last_int_ = 0;

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
    Generator: Generator,
    UniformGenerator: UniformGenerator
}