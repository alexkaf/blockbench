const fs = require("fs");
const path = require("path");
const {
    Keypair,
    PublicKey, sendAndConfirmTransaction,
} = require("@solana/web3.js");

const scriptDirectory = __dirname;

const writeKeypairToFile = (keypair, file) => {
    try {
        fs.mkdirSync('keys');
    } catch {}

    const keyString = keypair.secretKey.join(', ');
    const keypairPath = path.join(scriptDirectory, 'keys', file);
    fs.writeFileSync(
        keypairPath,
        `[${keyString}]`,
    );
    return {
        path: keypairPath,
        key: keypair,
    };
}

const readKeypairFromFile = (name) => {
    const keypairPath = path.join(scriptDirectory, 'keys', name);
    const secretKey = fs.readFileSync(keypairPath, 'utf8')
        .slice(1, -1)
        .split(', ')
        .map(elem => parseInt(elem));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));

}

const tryReadKeypairFromFile = (keypairFile) => {
    const keypairPath = path.join(scriptDirectory, 'keys', keypairFile);
    const secretKey = fs.readFileSync(keypairPath, 'utf8')
        .slice(1, -1)
        .split(', ')
        .map(elem => parseInt(elem));
    return Keypair.fromSecretKey(new Uint8Array(secretKey));

}

const keypairExists = (name) => {
    return fs.existsSync(path.join(scriptDirectory, 'keys', name));
}

const parseLogs = (logs) => {
    const parsed = logs.logs
        .filter((line) => line.startsWith('Program log:'))
        .map((line) => {
            return line.split(' ').slice(2).join(' ');
        })
        .join('\n');
    console.log('======LOGS======')
    console.log(parsed);
    console.log('======LOGS======')
}

const createPda = (data, programId) => {
    return PublicKey.findProgramAddressSync([
        new TextEncoder().encode(data.key),
    ], programId)[0];
}

const timeTx = async (connection, tx, signers, opts) => {
    const beforeTime = Date.now();
    await sendAndConfirmTransaction(connection, tx, signers, opts)
        .then((txId) => {
            const afterTime = Date.now();
            console.log(`${txId}: ${afterTime - beforeTime}ms`);
    });
}

module.exports = {
    writeKeyToFile: writeKeypairToFile,
    readKeyFromFile: readKeypairFromFile,
    tryReadKeypairFromFile: tryReadKeypairFromFile,
    keypairExists: keypairExists,
    parseLogs: parseLogs,
    createPda: createPda,
    timeTx: timeTx,
}