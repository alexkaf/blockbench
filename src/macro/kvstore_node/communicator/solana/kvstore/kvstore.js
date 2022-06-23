const {
    Blockchain,
} = require('../solana');
const defaults = require('../defaults');
const path = require("path");
const instruction = require("./instruction");

class KVstore extends Blockchain {
    contract = 'kvstore';
    contractPath = path.join(
        defaults.contractsDirectory, this.contract
    );

    compiledPath = path.join(
        defaults.contractsDirectory, this.contract, 'target', 'deploy', `${this.contract}.so`);

    async get(key) {
        await instruction.get(this.connection, this.feePayer, this.programId, {
            key: key
        });
    }

    async set(key, value) {
        await instruction.set(this.connection, this.feePayer, this.programId, {
            key: key,
            value: value,
        });
    }
}

module.exports = {
    KVstore: KVstore,
}


