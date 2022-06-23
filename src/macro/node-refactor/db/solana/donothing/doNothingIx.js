const {
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');


const doNothingIx = (feePayer, programId) => {
    return new TransactionInstruction({
        keys: [
            { pubkey: feePayer.publicKey, isSigner: true, isWritable: false},
        ],
        data: new Uint8Array([]),
        programId: programId,
    });
}

const doNothing = async (connection, feePayer, programId) => {
    const tx = new Transaction();
    const signers = [feePayer];

    tx.add(doNothingIx(feePayer, programId));

    return await connection.sendTransaction(tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });
}


module.exports = {
    do_nothing: doNothing,
}