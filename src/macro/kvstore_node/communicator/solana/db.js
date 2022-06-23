module.exports = {
    blockchain: require('./solana').Blockchain,
    kvstore: require('./kvstore/kvstore').KVstore,
    smallbank: require('./smallbank/smallbank').Smallbank,
}