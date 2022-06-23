const {
    Blockchain,
} = require('../solana');
const defaults = require('../defaults');
const path = require("path");
const instruction = require('./instruction');


class Smallbank extends Blockchain {
    contract = 'smallbank';
    contractPath = path.join(
        defaults.contractsDirectory, this.contract
    );

    compiledPath = path.join(
        defaults.contractsDirectory, this.contract, 'target', 'deploy', `${this.contract}.so`);

    async almagate(arg0, arg1) {
        await instruction.almagate(this.connection, this.feePayer, this.programId, {
            arg0: arg0,
            arg1: arg1,
        });
    }

    async getBalance(arg0) {
        await instruction.getBalance(this.connection, this.feePayer, this.programId, {
            arg0: arg0,
        });
    }

    async sendPayment(arg0, arg1, arg2) {
        await instruction.sendPayment(this.connection, this.feePayer, this.programId, {
            arg0: arg0,
            arg1: arg1,
            arg2: arg2,
        });
    }

    async updateBalance(arg0, arg1) {
        await instruction.updateBalance(this.connection, this.feePayer, this.programId, {
            arg0: arg0,
            arg1: arg1,
        });
    }

    async updateSaving(arg0, arg1) {
        await instruction.updateSaving(this.connection, this.feePayer, this.programId, {
            arg0: arg0,
            arg1: arg1,
        });
    }

    async writeCheck(arg0, arg1) {
        await instruction.writeCheck(this.connection, this.feePayer, this.programId, {
            arg0: arg0,
            arg1: arg1,
        });
    }
}

module.exports = {
    Smallbank: Smallbank,
}
