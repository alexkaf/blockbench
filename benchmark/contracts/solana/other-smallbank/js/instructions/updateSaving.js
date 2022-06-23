const borsh = require('borsh');
const {Transaction, TransactionInstruction, SystemProgram, sendAndConfirmTransaction} = require("@solana/web3.js");
const lib = require("./lib");

class UpdateSavingIx {
    ix = 3;
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
    UpdateSavingIx,
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
    const obj = new UpdateSavingIx(data);
    return borsh.serialize(ixSchema, obj);
}

const updateSavingIx = (feePayer, pda, buffer, programId) => {

    return new TransactionInstruction({
        keys: [
            { pubkey: feePayer.publicKey, isSigner: true, isWritable: false},
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
            { pubkey: pda.saving, isSigner: false, isWritable: true},
        ],
        data: buffer,
        programId: programId,
    });
}

const updateSaving = async (connection, feePayer, data, programId) => {
    const buffer = toData(data);
    const tx = new Transaction();
    const signers = [feePayer];
    const pdaSaving = lib.createPda(data.arg0, 'saving', programId);

    tx.add(updateSavingIx(feePayer, {
        saving: pdaSaving,
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
    updateSaving: updateSaving,
}