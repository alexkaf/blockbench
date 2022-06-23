const {
    Keypair,
    Connection,
} = require('@solana/web3.js');
const utils = require('./utils');

const SOL_1000 = 1000e9;

const createKey = (name, store = true) => {
    const keypair = new Keypair();
    if (store) {
        utils.writeKeyToFile(keypair, name)
    }
    return keypair;
}

const fundKey = async (connection, key) => {
    let keypair;
    if (typeof key === 'string') {
        keypair = utils.readKeyFromFile(key);
    }else {
        keypair = key;
    }
    const txId = await connection.requestAirdrop(keypair.publicKey, SOL_1000);
    await connection.confirmTransaction(txId, "confirmed");
}

const createAndFundKey = async (connection, name, fund = true, store = true) => {
    let key;
    if (utils.keypairExists(name))
        key = utils.tryReadKeypairFromFile(name);
    else {
        key = createKey(name, store);
    }
    if (fund) {
        await fundKey(connection, key);
    }
    return key
}

module.exports = {
    createKey: createAndFundKey,
}

