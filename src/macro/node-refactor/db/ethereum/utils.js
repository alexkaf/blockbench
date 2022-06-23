const path = require("path");
const fs = require("fs");
const Web3 = require('web3');

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

const getTip = async (connection) => {
    return (await connection.eth.getBlock('latest')).number;
}

const submitDoNothingTx = async (contract) => {
    return await contract.methods.nothing().call();
}

const submitGetTxn = async (contract, key) => {
    return await contract.methods.get(key).call();
}

const submitSetTxn = async (contract, key, value) => {
    return await contract.methods.set(key, value).send();
}
const pollTxsByBlockNumber = async (connection, blockNumber) => {
    return (await connection.eth.getBlock(blockNumber)).transactions;
}



module.exports = {
    get_from_address: getFromAddress,
    deploy_smart_contract: deploySmartContract,
    get_tip_block_number: getTip,
    submit_do_nothing_txn: submitDoNothingTx,
    submit_get_txn: submitGetTxn,
    submit_set_txn: submitSetTxn,
    poll_txs_by_block_number: pollTxsByBlockNumber,
}