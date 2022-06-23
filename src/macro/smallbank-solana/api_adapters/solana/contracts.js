module.exports = {
    almagate: require('./smallbank/almagate').almagate,
    getBalance: require('./smallbank/getBalance').getBalance,
    updateBalance: require('./smallbank/updateBalance').updateBalance,
    updateSaving: require('./smallbank/updateSaving').updateSaving,
    sendPayment: require('./smallbank/sendPayment').sendPayment,
    writeCheck: require('./smallbank/writeCheck').writeCheck,
}