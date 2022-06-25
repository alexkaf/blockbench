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
const arraySize = parseInt(process.argv[2]);
const bytesToAllocate = 8 * arraySize;

const scriptDirectory = __dirname;
const contractFile = `${scriptDirectory}/../../solana_script/deployed_programs/cpuheavy`;
const feePayerPath = `${scriptDirectory}/../../solana_script/feePayer`;

const connection = new Connection('http://localhost:8899/');

const sort = async () => {
    const programId = readKeyPair(contractFile);
    const feePayer = readKeyPair(feePayerPath);

    const dataAccount = new Keypair();

    const tx = new Transaction();
    const signers = [feePayer, dataAccount];
    const units_request = ComputeBudgetProgram.requestUnits({
        additionalFee: 20000,
        units: 4000000
    });
    const units = ComputeBudgetProgram.setComputeUnitLimit({
        units: 4000000000
    });

    // tx.add(units_request);
    tx.add(units);
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

    const startTime = Date.now();

    const txId = await sendAndConfirmTransaction(connection, tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });

    const endTime = Date.now();

    return {
        'hash': txId,
        'latency': (endTime - startTime)
    }
}

const a = sort();
console.log(a);