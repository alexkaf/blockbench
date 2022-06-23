const { Generator } = require('./generator');

class ConstGenerator extends Generator {

    constant_;

    constructor(constant) {
        super();
        this.constant_ = constant;
    }

    Next() {
        return this.constant_;
    }

    Last() {
        return this.constant_;
    }
}

module.exports = {
    ConstGenerator: ConstGenerator,
}