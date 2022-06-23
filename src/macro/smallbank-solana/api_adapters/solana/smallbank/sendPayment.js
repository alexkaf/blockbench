const borsh = require('borsh');
const {
    Transaction,
    TransactionInstruction,
    SystemProgram,
} = require("@solana/web3.js");
const utils = require('./utils');

class SendPaymentIx {
    ix = 4;
    arg0;
    arg1;
    arg2;


    constructor(props) {
        Object.keys(props)
            .map((key) => {
                this[key] = props[key];
            })
    }
}

const ixSchema = new Map([[
    SendPaymentIx,
    {
        kind: 'struct',
        fields: [
            ['ix', 'u8'],
            ['arg0', 'string'],
            ['arg1', 'string'],
            ['arg2', 'u256'],
        ]
    }
]]);

const toData = (data) => {
    const obj = new SendPaymentIx(data);
    return borsh.serialize(ixSchema, obj);
}

const sendPaymentIx = (feePayer, pda, buffer, programId) => {

    return new TransactionInstruction({
        keys: [
            { pubkey: feePayer.publicKey, isSigner: true, isWritable: false},
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
            { pubkey: pda.checking0, isSigner: false, isWritable: true},
            { pubkey: pda.checking1, isSigner: false, isWritable: true},
        ],
        data: buffer,
        programId: programId,
    });
}

const sendPayment = async (connection, feePayer, data, programId) => {
    const buffer = toData(data);
    const tx = new Transaction();
    const signers = [feePayer];
    const pdaChecking0 = utils.createPda(data.arg0, 'checking', programId);
    const pdaChecking1 = utils.createPda(data.arg1, 'checking', programId);

    tx.add(sendPaymentIx(feePayer, {
        checking0: pdaChecking0,
        checking1: pdaChecking1,
    }, buffer, programId));

    return await connection.sendTransaction(tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });

}


module.exports = {
    sendPayment: sendPayment,
}