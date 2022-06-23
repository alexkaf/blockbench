const {
    TransactionInstruction,
    Transaction, sendAndConfirmTransaction, SystemProgram, PublicKey,
} = require('@solana/web3.js');
const utils = require('../utils');
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
    const pda = utils.createPda(data, programId);

    tx.add(getIx(feePayer, pda, buffer, programId))

    await utils.timeTx(connection, tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });
}


module.exports = {
    get: get_value,
}