const path = require("path");
const fs = require("fs");
const Web3 = require('web3');
const contractsIx = require("../solana/contracts");

const VALUE_1_ETH = Web3.utils.toWei('1', 'ether');
const VALUE_10_GWEI = Web3.utils.toWei('10', 'gwei');
const VALUE_100_GWEI = Web3.utils.toWei('100', 'gwei');

const readAbiFromFile = (contractPath) => {
    const abiPath = path.join(contractPath, 'abi');
    return JSON.parse(fs.readFileSync(abiPath).toString());
}

const readByteCodeFromFile = (contractPath) => {
    const bytecodePath = path.join(contractPath, 'bytecode');
    return fs.readFileSync(bytecodePath).toString();
}

const readAbiAndBytecode = (contractPath) => {
    return {
        abi: readAbiFromFile(contractPath),
        bytecode: readByteCodeFromFile(contractPath),
    };
}

const getFromAddress = async (connection) => {
    return (await connection.eth.personal.getAccounts())[0];
}

const getBlockGasLimit = async (connection) => {
    return (await connection.eth.getBlock('latest')).gasLimit;
}

const deploySmartContract = async (connection, fromAddress, contractName) => {
    const contractPath = path.join(__dirname, contractName);
    const contractMeta = readAbiAndBytecode(contractPath);
    const blockGasLimit = await getBlockGasLimit(connection);

    const contract = new connection.eth.Contract(contractMeta.abi);
    const meta = {
        from: fromAddress,
        gas: blockGasLimit,
        gasPrice: VALUE_10_GWEI,
    };

    const programId = (await contract.deploy({
        data: contractMeta.bytecode,
    }).send(meta, () => {})).options.address;

    contract.options.address = programId;
    contract.options.from = fromAddress;

    return {
        contractObject: contract,
        programId: programId,
    };
}

const getTipBlockNumber = async (connection) => {
    return (await connection.eth.getBlock('latest')).number;
}

const submitAlmagateTxn = async (contract, acc1, acc2) => {
    return await contract.methods.almagate(acc1, acc2).send();
}

const submitGetBalanceTxn = async (contract, acc) => {
    return await contract.methods.getBalance(acc).send();
}

const submitUpdateBalanceTxn = async (contract, acc, amount) => {
    return await contract.methods.updateBalance(acc, amount).send();
}

const submitUpdateSavingTxn = async (contract, acc, amount) => {
    return await contract.methods.updateSaving(acc, amount).send();
}

const submitSendPaymentTxn = async (contract, acc1, acc2, amount) => {
    return await contract.methods.sendPayment( acc1, acc2, amount).send();
}

const submitWriteCheckTxn = async (contract, acc, amount) => {
    return await contract.methods.writeCheck(acc, amount).send();
}


const pollTxsByBlockNumber = async (connection, blockNumber) => {
    return (await connection.eth.getBlock(blockNumber)).transactions;
}



module.exports = {
    get_from_address: getFromAddress,
    deploy_smart_contract: deploySmartContract,
    get_tip_block_number: getTipBlockNumber,
    submit_almagate_txn: submitAlmagateTxn,
    poll_txs_by_block_number: pollTxsByBlockNumber,
    submit_getBalance_txn: submitGetBalanceTxn,
    submit_updateBalance_txn: submitUpdateBalanceTxn,
    submit_updateSaving_txn: submitUpdateSavingTxn,
    submit_sendPayment_txn: submitSendPaymentTxn,
    submit_writeCheck_txn: submitWriteCheckTxn,
}