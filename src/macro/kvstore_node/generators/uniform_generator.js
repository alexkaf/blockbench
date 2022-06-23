const {
    Generator,
} =  require('./generator');

class UniformGenerator extends Generator {

    max;
    min;
    last_int;

    constructor(min, max) {
        super();
        this.min = min;
        this.max = max;

        this.Next();
    }

    Next() {
        this.last_int = this.#getRandomInt();
        return this.last_int;
    }

    Last() {
        return this.last_int;
    }

    #getRandomInt() {
        return Math.floor(Math.random() * (this.max - this.min)) + this.min;
    }
}

module.exports = {
    generator: UniformGenerator,
}