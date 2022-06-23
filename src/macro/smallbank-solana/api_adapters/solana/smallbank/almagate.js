const borsh = require('borsh');
const {
    Transaction,
    TransactionInstruction,
    SystemProgram,
} = require("@solana/web3.js");
const utils = require('./utils');

class AlmaGateIx {
    ix = 0;
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
    AlmaGateIx,
    {
        kind: 'struct',
        fields: [
            ['ix', 'u8'],
            ['arg0', 'string'],
            ['arg1', 'string'],
        ]
    }
]]);

const toData = (data) => {
    const obj = new AlmaGateIx(data);
    return borsh.serialize(ixSchema, obj);
}

const almagateIx = (feePayer, pda, buffer, programId) => {

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

const almagate = async (connection, feePayer, data, programId) => {
    const buffer = toData(data);
    const tx = new Transaction();
    const signers = [feePayer];
    const pdaSaving = utils.createPda(data.arg0, 'saving', programId);
    const pdaChecking = utils.createPda(data.arg1, 'checking', programId);

    tx.add(almagateIx(feePayer, {
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
    almagate: almagate,
}