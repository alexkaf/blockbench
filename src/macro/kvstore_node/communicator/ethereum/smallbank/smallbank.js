const { Blockchain } = require('../ethereum');

class Smallbank extends Blockchain {
    contract = 'smallbank';

    async almagate (arg0, arg1) {
        const beforeTime = Date.now();
        const almagateResult = await this.deployedContract.methods.almagate(arg0,  arg1).send({
            from: this.account,
        });
        const afterTime = Date.now();
        console.log(`Almagate done in ${afterTime - beforeTime}ms`);
    }

    async getBalance (arg0) {
        const beforeTime = Date.now();
        const getBalanceResult = await this.deployedContract.methods.getBalance(arg0).send({
            from: this.account,
        });
        const afterTime = Date.now();
        console.log(`GetBalance done in ${afterTime - beforeTime}ms`);
    }

    async updateBalance (arg0, arg1) {
        const beforeTime = Date.now();
        const updateBalanceResult = await this.deployedContract.methods.updateBalance(arg0,  arg1).send({
            from: this.account,
        });
        const afterTime = Date.now();
        console.log(`UpdateBalance done in ${afterTime - beforeTime}ms`);
    }

    async updateSaving (arg0, arg1) {
        const beforeTime = Date.now();
        const updateSavingResult = await this.deployedContract.methods.updateSaving(arg0,  arg1).send({
            from: this.account,
        });
        const afterTime = Date.now();
        console.log(`UpdateSaving done in ${afterTime - beforeTime}ms`);
    }

    async sendPayment (arg0, arg1) {
        const beforeTime = Date.now();
        const sendPaymentResult = await this.deployedContract.methods.sendPayment(arg0,  arg1).send({
            from: this.account,
        });
        const afterTime = Date.now();
        console.log(`SendPayment done in ${afterTime - beforeTime}ms`);
    }

    async writeCheck (arg0, arg1) {
        const beforeTime = Date.now();
        const writeCheckResult = await this.deployedContract.methods.writeCheck(arg0,  arg1).send({
            from: this.account,
        });
        const afterTime = Date.now();
        console.log(`WriteCheck done in ${afterTime - beforeTime}ms`);
    }
}

module.exports = {
    Smallbank: Smallbank,
}