const {
    PublicKey, SystemProgram
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

// const createAccountIx = async (connection, accountAddress, feePayer, owner, size) => {
//     const createIx = SystemProgram.createAccount({
//
//         }
//     )
// }

const createPda = async (connection, data, type, programId) => {
    const pda = PublicKey.findProgramAddressSync([
        new TextEncoder().encode(data),
        new TextEncoder().encode(type),
    ], programId)[0];
    const pdaInfo = await connection.getAccountInfo();

    if (pdaInfo.owner === SystemProgram.programId) {

    }
}

const monitorLogs = (connection, programId) => {
    const logger = connection.onLogs(programId, (log) => {
        parseLogs(log);
    }, "confirmed");
}

module.exports = {
    createPda: createPda,
    monitorLogs: monitorLogs,
}