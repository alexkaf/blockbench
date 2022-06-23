const db = {
    solana: {
        kvstore: require('./solana/kvstore/kvstore').KVstore,
        smallbank: require('./solana/smallbank/smallbank').Smallbank,
    },
    ethereum: {
        kvstore: require('./ethereum/kvstore/kvstore').KVstore,
        smallbank: require('./ethereum/smallbank/smallbank').Smallbank,
    }
}

module.exports = {
    db: db,
}