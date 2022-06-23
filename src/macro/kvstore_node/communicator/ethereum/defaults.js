const path = require('path');
const web3 = require('web3');

const currentDirectory = __dirname;
const relativeContractsDirectory = 'contracts';

const absoluteContractsDirectory = path.join(
    currentDirectory, relativeContractsDirectory,
);

const value_1Eth = web3.utils.toWei('1', 'ether');
const value_1EthHex = web3.utils.toHex('25000000');

const value_10Gwei = web3.utils.toWei('10', 'gwei');
const value_10GweiHex = web3.utils.toHex(value_10Gwei);

module.exports = {
    contractsDirectory: absoluteContractsDirectory,
    value_1Eth: value_1EthHex,
    value_10Gwei: value_10GweiHex,
}