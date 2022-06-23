const {
    TransactionInstruction,
    Transaction, sendAndConfirmTransaction, SystemProgram, PublicKey,
} = require('@solana/web3.js');
const utils = require('../utils');
const borsh = require('borsh');

class SetIx {
    ix = 1;
    key;
    value;

    constructor(key_val) {
        Object.keys(key_val)
            .map((elem) => {
                this[elem] = key_val[elem];
            });
    }
}

const ixScheme = new Map([
    [SetIx, {
        kind: 'struct',
        fields: [
            ['ix', 'u8'],
            ['key', 'string'],
            ['value', 'string'],
        ],
    }
    ]
]);

const toData = (data) => {
    const ixData = new SetIx(data);
    return borsh.serialize(ixScheme, ixData);
}

const setIx = (feePayer, pda, buffer, programId) => {
    return new TransactionInstruction({
        keys: [
            { pubkey: feePayer.publicKey, isSigner: true, isWritable: false},
            { pubkey: pda, isSigner: false, isWritable: true},
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: buffer,
        programId: programId,
    });
}

const set_value = async (connection, feePayer, programId, data) => {
    console.log('Kikirikoy', programId.toString())
    const buffer = toData(data);
    const tx = new Transaction();
    const signers = [feePayer];
    const pda = utils.createPda(data, programId);

    tx.add(setIx(feePayer, pda, buffer, programId))

    await utils.timeTx(connection, tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });
}


module.exports = {
    set: set_value,
}