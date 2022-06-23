const path = require('path');
const execSync = require('child_process').execSync;
const fs = require('fs');
const {Keypair, Connection, PublicKey} = require("@solana/web3.js");
const contractsIx = require('./contracts');

const contractsRelativePath = 'benchmark/contracts/solana';
const contracts = path.join(__dirname, '../../../../..', contractsRelativePath);

const readKeypairFromFile = (feePayerPath) => {
    const contents = fs.readFileSync(feePayerPath)
        .toString('utf8')
        .slice(1, -1)
        .split(',')
        .map((num) => {
            return parseInt(num);
        });
    return Keypair.fromSecretKey(new Uint8Array(contents));
}

const writeKeypairToFile = (feePayer, feePayerPath) => {
    const contents = `[${feePayer.secretKey.toString()}]`
    fs.writeFileSync(feePayerPath, contents);
}

const get_from_address = async (connection) => {
    let feePayer;
    const feePayerPath = path.join(__dirname, 'feePayer');

    if (fs.existsSync(feePayerPath)){
        feePayer = readKeypairFromFile(feePayerPath);
    } else {
        feePayer = new Keypair();
        writeKeypairToFile(feePayer, feePayerPath);
    }
    await connection.requestAirdrop(feePayer.publicKey, 100e9);
    return feePayer;
}

const compileSmartContract = (smartContract) => {
    const previousDirectory = process.cwd();
    const contract = path.join(contracts, smartContract);
    process.chdir(contract);
    execSync('cargo build-bpf', {
        'stdio': 'pipe'
    });
    process.chdir(previousDirectory);
}

const deploySmartContract = (smartContract) => {
    compileSmartContract(smartContract);

    const feePayerPath = path.join(__dirname, 'feePayer');
    const contract = path.join(contracts, smartContract);

    const programId = execSync(`solana program deploy -k ${feePayerPath} ${contract}/target/deploy/${smartContract}.so`, {
        'stdio': 'pipe',
    })
        .toString()
        .split('\n')[0]
        .split(' ')[2]
        .trim();

    return new PublicKey(programId);
}

const getTipBlockNumber = async (connection) => {
    return await connection.getSlot("finalized");
}

const pollTxsByBlockNumber = async (connection, blockSlot) => {
    return await connection.getSlot(blockSlot);
}

const submitAlmagateTxn = async (connection, feePayer, data, programId) => {
    return await contractsIx.almagate(connection, feePayer, data, programId);
}

const submitGetBalanceTxn = async (connection, feePayer, data, programId) => {
    return await contractsIx.getBalance(connection, feePayer, data, programId);
}

const submitUpdateBalanceTxn = async (connection, feePayer, data, programId) => {
    return await contractsIx.updateBalance(connection, feePayer, data, programId);
}

const submitUpdateSavingTxn = async (connection, feePayer, data, programId) => {
    return await contractsIx.updateSaving(connection, feePayer, data, programId);
}

const submitSendPaymentTxn = async (connection, feePayer, data, programId) => {
    return await contractsIx.sendPayment(connection, feePayer, data, programId);
}

const submitWriteCheckTxn = async (connection, feePayer, data, programId) => {
    return await contractsIx.writeCheck(connection, feePayer, data, programId);
}

module.exports = {
    contractsDirectory: contracts,
    get_from_address: get_from_address,
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