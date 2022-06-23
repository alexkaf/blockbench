const {
    Generator,
} =  require('./generator');

class ConstantGenerator extends Generator {

    constant;

    constructor(constant) {
        super();
        this.constant = constant;
    }

    Next() {
        return this.constant;
    }

    Last() {
        return this.constant;
    }
}

module.exports = {
    generator: ConstantGenerator,
}