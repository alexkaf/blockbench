const {
    PublicKey,
    Keypair,
} =  require('@solana/web3.js');

const {
    readFileSync,
    writeFile,
} = require('fs');

const readFromFile = (filePath) => {
    let dataWallet = readFileSync(`${filePath}`, 'utf8');

    if (!dataWallet.startsWith('[')) {
        return new PublicKey(dataWallet.trim());
    }

    dataWallet = dataWallet.slice(1, -1);
    dataWallet = new Uint8Array(dataWallet.split(',').map((elem) => parseInt(elem)));

    try {
        return new PublicKey(dataWallet);
    }catch {
        return Keypair.fromSecretKey(dataWallet);
    }
}

function writeKeyPairToFile(filename, account) {
    let key;
    try {
        key = Uint8Array.from(account.toBuffer());
    }catch {
        key = account.secretKey;
    }

    let stringContent = key.join(', ');
    writeFile(`./${filename}`, `[${stringContent}]`, () => {});
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

module.exports = {
    readKeyPair: readFromFile,
    writeKeyPair: writeKeyPairToFile,
    parseLogs: parseLogs,
}