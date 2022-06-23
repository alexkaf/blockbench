const borsh = require('borsh');
const {
    Transaction,
    TransactionInstruction,
    SystemProgram,
} = require("@solana/web3.js");
const utils = require('./utils');

class GetBalanceIx {
    ix = 1;
    arg0;


    constructor(props) {
        Object.keys(props)
            .map((key) => {
                this[key] = props[key];
            })
    }
}

const ixSchema = new Map([[
    GetBalanceIx,
    {
        kind: 'struct',
        fields: [
            ['ix', 'u8'],
            ['arg0', 'string'],
        ]
    }
]]);

const toData = (data) => {
    const obj = new GetBalanceIx(data);
    return borsh.serialize(ixSchema, obj);
}

const getBalanceIx = (feePayer, pda, buffer, programId) => {

    return new TransactionInstruction({
        keys: [
            { pubkey: feePayer.publicKey, isSigner: true, isWritable: false},
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
            { pubkey: pda.saving, isSigner: false, isWritable: true},
            { pubkey: pda.checking, isSigner: false, isWritable: true},
        ],
        data: buffer,
        programId: programId,
    });
}

const getBalance = async (connection, feePayer, data, programId) => {
    const buffer = toData(data);
    const tx = new Transaction();
    const signers = [feePayer];
    const pdaSaving = utils.createPda(data.arg0, 'saving', programId);
    const pdaChecking = utils.createPda(data.arg0, 'checking', programId);

    tx.add(getBalanceIx(feePayer, {
        checking: pdaChecking,
        saving: pdaSaving,
    }, buffer, programId));

    return await connection.sendTransaction(tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });

}


module.exports = {
    getBalance: getBalance,
}