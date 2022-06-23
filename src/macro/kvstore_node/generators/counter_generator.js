const {
    Generator,
} =  require('./generator');

class CounterGenerator extends Generator {

    counter_;

    constructor(start) {
        super();
        this.counter_ = start;
    }

    Next() {
        this.counter_ += 1
        return this.counter_;
    }

    Last() {
        return this.counter_ - 1;
    }

    Set(start) {
        this.counter_ = start;
    }
}

module.exports = {
    generator: CounterGenerator,
}