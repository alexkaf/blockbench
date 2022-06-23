const { Blockchain } = require('../ethereum');

class KVStore extends Blockchain {
    contract = 'kvstore';

    async set (key, value) {
        const beforeTime = Date.now();
        const setResult = await this.deployedContract.methods.set(key, value).send({
            from: this.account,
        });
        const afterTime = Date.now();
        console.log(`Set done in ${afterTime - beforeTime}ms`);
    }

    async get (key) {
        const beforeTime = Date.now();
        await this.deployedContract.methods.get(key).call();
        const afterTime = Date.now();

        console.log(`Get done in ${afterTime - beforeTime}ms`);
    }
}

module.exports = {
    KVStore: KVStore,
}