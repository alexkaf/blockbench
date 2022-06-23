const fs = require('fs');
const defaults = require('./defaults');
const path = require("path");

const readAbiFromFile = (contract) => {
    const abiPath = path.join(defaults.contractsDirectory, contract, 'abi');
    return JSON.parse(fs.readFileSync(abiPath).toString());
}

const readByteCodeFromFile = (contract) => {
    const bytecodePath = path.join(defaults.contractsDirectory, contract, 'bytecode');
    return fs.readFileSync(bytecodePath).toString();
}

const readAbiAndBytecode = (contract) => {
    return {
        abi: readAbiFromFile(contract),
        bytecode: readByteCodeFromFile(contract),
    };
}

module.exports = {
    readContract: readAbiAndBytecode,
}
