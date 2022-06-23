const path = require('path');

const currentDirectory = __dirname;
const relativeContractsDirectory = 'benchmark/contracts/solana';
const relationship = '../../../../../';

const absoluteContractsDirectory = path.join(
    currentDirectory, relationship, relativeContractsDirectory,
);

const feePayerPath = path.join(__dirname, 'keys/feePayer');

module.exports = {
    contractsDirectory: absoluteContractsDirectory,
    feePayerPath: feePayerPath,
}