const Web3 = require('web3');

const getProvider = (endpoint) => {
    return new Web3(new Web3.providers.WebsocketProvider(`ws://${endpoint}:8546`));
}

const collectAccounts = async () => {

}

module.exports = {
    getProvider: getProvider,
}