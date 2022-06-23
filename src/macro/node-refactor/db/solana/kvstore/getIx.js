const {
    TransactionInstruction,
    Transaction,
    SystemProgram, sendAndConfirmTransaction,
} = require('@solana/web3.js');
const utils = require('./utils');
const borsh = require('borsh');

class GetIx {
    ix = 2;
    key;

    constructor(key) {
        this.key = key;
    }
}

const ixScheme = new Map([
    [GetIx, {
        kind: 'struct',
        fields: [
            ['ix', 'u8'],
            ['key', 'string'],
        ],
    }
    ]
]);

const toData = (data) => {
    const ixData = new GetIx(data);
    return borsh.serialize(ixScheme, ixData);
}

const getIx = (feePayer, pda, buffer, programId) => {

    return new TransactionInstruction({
        keys: [
            { pubkey: feePayer.publicKey, isSigner: true, isWritable: false},
            { pubkey: pda, isSigner: false, isWritable: false},
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
        ],
        data: buffer,
        programId: programId,
    });
}


const get_value = async (connection, feePayer, programId, data) => {
    const buffer = toData(data.key);
    const tx = new Transaction();
    const signers = [feePayer];
    const pda = utils.create_pda(data, programId);

    tx.add(getIx(feePayer, pda, buffer, programId))

    const start_time = new Date();
    return sendAndConfirmTransaction(connection, tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    }).then(async (txId) => {
        return {
            hash: txId,
            start_time: start_time,
        };
    });
}


module.exports = {
    get: get_value,
}