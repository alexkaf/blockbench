#!/bin/node

const {
    Connection, Transaction, Keypair, SystemProgram, TransactionInstruction, sendAndConfirmTransaction, PublicKey,
    ComputeBudgetProgram
} = require('@solana/web3.js');
const {
    readKeyPair,
    writeKeyPair
} = require('../../solana_aux');
const fs = require('fs');
const BN = require('bn.js');

const start = parseInt(process.argv[2]);
const end = parseInt(process.argv[3]);
const step = parseInt(process.argv[4]);

const bytesToAllocate = 8 * start;

const scriptDirectory = __dirname;
const contractFile = `${scriptDirectory}/../../solana_script/deployed_programs/cpuheavy`;
const feePayerPath = `${scriptDirectory}/../../solana_script/feePayer`;

const connection = new Connection('http://10.201.252.8:8899/');

const sort = async (size) => {
    if (size === undefined) size = start;
    const programId = readKeyPair(contractFile);
    const feePayer = readKeyPair(feePayerPath);

    const dataAccount = new Keypair();

    const tx = new Transaction();
    const signers = [feePayer, dataAccount];

    const units_limit = ComputeBudgetProgram.setComputeUnitLimit({
        units: 4000000000
    });
    tx.add(units_limit);

    const createDataAccount = await SystemProgram.createAccount({
        fromPubkey: feePayer.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(8 * size),
        space: 8 * size,
        programId: programId.publicKey
    });
    tx.add(createDataAccount);

    const sortIx = new TransactionInstruction({
        keys: [
            { pubkey: dataAccount.publicKey, isSigner: false, isWritable: true},
        ],
        data: new BN(size).toArray('le', 8),
        programId: programId.publicKey,
    });
    tx.add(sortIx);

    const startTime = Date.now();

    const txId = await sendAndConfirmTransaction(connection, tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });

    const endTime = Date.now();
    console.log({
        'size': size,
        'hash': txId,
        'latency': (endTime - startTime)
    });

    return {
        'size': size,
        'hash': txId,
        'latency': (endTime - startTime)
    }
}

const runExperiments = async () => {
    for (let current = start; current <= end; current += step) {
        console.log(`${100 * current / end}%`);
        let run = await sort(current);
        fs.appendFileSync('results', `${run.hash}, ${run.size}, ${run.latency}\n`);
    }
}

if (!isNaN(end) && !(isNaN(step))) {
    runExperiments();
} else{
    sort();
}