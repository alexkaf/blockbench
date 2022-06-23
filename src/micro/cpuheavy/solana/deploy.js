#!/bin/node

const {
    Connection, Transaction, Keypair, SystemProgram, TransactionInstruction, sendAndConfirmTransaction, PublicKey,
} = require('@solana/web3.js');
const {
    readKeyPair,
    writeKeyPair
} = require('../../solana_aux');

const BN = require('bn.js');
const arraySize = parseInt(process.argv[2]);
const bytesToAllocate = 8 * arraySize;

const scriptDirectory = __dirname;
const contractFile = `${scriptDirectory}/../../solana_script/deployed_programs/cpuheavy`;
const feePayerPath = `${scriptDirectory}/../../solana_script/feePayer`;

const connection = new Connection('http://localhost:8899/');

const sort = (async () => {
    const programId = readKeyPair(contractFile);
    const feePayer = readKeyPair(feePayerPath);

    const dataAccount = new Keypair();

    const tx = new Transaction();
    const signers = [feePayer, dataAccount];

    console.time(`Create and execute sort for ${arraySize} elements`);
    const createDataAccount = await SystemProgram.createAccount({
        fromPubkey: feePayer.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(bytesToAllocate),
        space: bytesToAllocate,
        programId: programId,
    });
    tx.add(createDataAccount);

    const sortIx = new TransactionInstruction({
        keys: [
            { pubkey: dataAccount.publicKey, isSigner: false, isWritable: true},
        ],
        data: new BN(arraySize).toArray('le', 8),
        programId: programId,
    });
    tx.add(sortIx);

    const txId = await sendAndConfirmTransaction(connection, tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });

    console.log(`TX: ${txId}`);
    console.timeEnd(`Create and execute sort for ${arraySize} elements`);
})();