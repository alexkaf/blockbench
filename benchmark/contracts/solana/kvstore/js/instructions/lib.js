const {
    PublicKey
} = require("@solana/web3.js");

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

module.exports = {
    parseLogs: parseLogs,
    createPda: createPda,
}