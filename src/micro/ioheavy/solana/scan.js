#!/bin/node

const {
    Connection, Transaction, Keypair, SystemProgram, TransactionInstruction, sendAndConfirmTransaction, PublicKey,
} = require('@solana/web3.js');
const {
    readKeyPair,
    writeKeyPair
} = require('../../solana_aux');

const BN = require('bn.js');

const start_key = process.argv[2];
const total_key_num = process.argv[3];

const instruction_data = new Uint8Array([
    ...new Uint8Array([3]),
    ...new BN(start_key).toArray('le', 8),
    ...new BN(total_key_num).toArray('le', 8),
])
const bytesToAllocate = 1048576;


const scriptDirectory = __dirname;
const contractFile = `${scriptDirectory}/../../solana_script/deployed_programs/ioheavy`;
const feePayerPath = `${scriptDirectory}/../../solana_script/feePayer`;

const connection = new Connection('http://localhost:8899/');

const write = (async () => {
    const programId = readKeyPair(contractFile);
    const feePayer = readKeyPair(feePayerPath);

    const dataAccount = new Keypair();

    const tx = new Transaction();
    const signers = [feePayer, dataAccount];

    console.time(`Create and execute scan`)
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
        data: instruction_data,
        programId: programId,
    });
    tx.add(sortIx);

    const txId = await sendAndConfirmTransaction(connection, tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });

    console.log(`TX: ${txId}`);
    console.timeEnd(`Create and execute scan`);
})();