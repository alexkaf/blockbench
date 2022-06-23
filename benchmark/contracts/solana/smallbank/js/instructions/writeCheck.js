const borsh = require('borsh');
const {Transaction, TransactionInstruction, SystemProgram, sendAndConfirmTransaction} = require("@solana/web3.js");
const lib = require("./lib");

class WriteCheckIx {
    ix = 5;
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
    WriteCheckIx,
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
    const obj = new WriteCheckIx(data);
    return borsh.serialize(ixSchema, obj);
}

const writeCheckIx = (feePayer, pda, buffer, programId) => {

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

const writeCheck = async (connection, feePayer, data, programId) => {
    const buffer = toData(data);
    const tx = new Transaction();
    const signers = [feePayer];
    const pdaSaving = lib.createPda(data.arg0, 'saving', programId);
    const pdaChecking = lib.createPda(data.arg0, 'checking', programId);

    tx.add(writeCheckIx(feePayer, {
        saving: pdaSaving,
        checking: pdaChecking,
    }, buffer, programId));

    lib.monitorLogs(connection, programId);

    const txId = await sendAndConfirmTransaction(connection, tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });

    console.log('Tx', txId);

}


module.exports = {
    writeCheck: writeCheck,
}