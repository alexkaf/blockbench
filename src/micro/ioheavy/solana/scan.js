#!/bin/node

const {
    Connection, Transaction, Keypair, SystemProgram, TransactionInstruction, sendAndConfirmTransaction, PublicKey,
    ComputeBudgetProgram
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
const dataAccount = `${scriptDirectory}/dataAccount`;

const connection = new Connection('http://localhost:8899/');

const write = (async () => {
    let dataKeyPair;
    const programId = readKeyPair(contractFile);
    const feePayer = readKeyPair(feePayerPath);
    let tx = new Transaction();
    let signers = [feePayer];

    try {
        dataKeyPair = readKeyPair(dataAccount);
    } catch {
        dataKeyPair = new Keypair();
    }

    let data = (await connection.getAccountInfo(dataKeyPair.publicKey, 'confirmed'));
    if (data == null) {
        const createDataAccount = await SystemProgram.createAccount({
            fromPubkey: feePayer.publicKey,
            newAccountPubkey: dataKeyPair.publicKey,
            lamports: await connection.getMinimumBalanceForRentExemption(bytesToAllocate),
            space: bytesToAllocate,
            programId: programId.publicKey,
        });
        tx.add(createDataAccount);
        signers.push(dataKeyPair);
    }


    const units_limit = ComputeBudgetProgram.setComputeUnitLimit({
        units: 4000000000
    });

    tx.add(units_limit);

    console.time(`Create and execute scan`)
    const sortIx = new TransactionInstruction({
        keys: [
            { pubkey: dataKeyPair.publicKey, isSigner: false, isWritable: true},
        ],
        data: instruction_data,
        programId: programId.publicKey,
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