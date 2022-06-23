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
    await connection.requestAirdrop(feePayer.publicKey, 10e9);
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

const doNothing = async (connection, feePayer, programId) => {
    return await contractsIx.do_nothing(connection, feePayer, programId);
}

const submitGetTxn = async (connection, feePayer, programId, data) => {
    return await contractsIx.get_ix(connection, feePayer, programId, data);
}

const submitSetTxn = async (connection, feePayer, programId, data) => {
    return await contractsIx.set_ix(connection, feePayer, programId, data);
}

const pollTxsByBlockNumber = async (connection, blockSlot) => {
    return await connection.getSlot(blockSlot);
}

module.exports = {
    contractsDirectory: contracts,
    get_from_address: get_from_address,
    deploy_smart_contract: deploySmartContract,
    get_tip_block_number: getTipBlockNumber,
    submit_do_nothing_txn: doNothing,
    submit_get_txn: submitGetTxn,
    submit_set_txn: submitSetTxn,
    poll_txs_by_block_number: pollTxsByBlockNumber,
}