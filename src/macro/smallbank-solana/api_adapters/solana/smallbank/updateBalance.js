const borsh = require('borsh');
const {
    Transaction,
    TransactionInstruction,
    SystemProgram,
} = require("@solana/web3.js");
const utils = require('./utils');

class UpdateBalanceIx {
    ix = 2;
    arg0;
    arg1;


    constructor(props) {
        Object.keys(props)
            .map((key) => {
                this[key] = props[key];
            })
    }
}

const ixSchema = new Map([[
    UpdateBalanceIx,
    {
        kind: 'struct',
        fields: [
            ['ix', 'u8'],
            ['arg0', 'string'],
            ['arg1', 'u256'],
        ]
    }
]]);

const toData = (data) => {
    const obj = new UpdateBalanceIx(data);
    return borsh.serialize(ixSchema, obj);
}

const updateBalanceIx = (feePayer, pda, buffer, programId) => {

    return new TransactionInstruction({
        keys: [
            { pubkey: feePayer.publicKey, isSigner: true, isWritable: false},
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
            { pubkey: pda.checking, isSigner: false, isWritable: true},
        ],
        data: buffer,
        programId: programId,
    });
}

const updateBalance = async (connection, feePayer, data, programId) => {
    const buffer = toData(data);
    const tx = new Transaction();
    const signers = [feePayer];
    const pdaChecking = utils.createPda(data.arg0, 'checking', programId);

    tx.add(updateBalanceIx(feePayer, {
        checking: pdaChecking,
    }, buffer, programId));

    return await connection.sendTransaction(tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });
}


module.exports = {
    updateBalance: updateBalance,
}