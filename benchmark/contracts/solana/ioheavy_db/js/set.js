const { PublicKey, Transaction, Connection, TransactionInstruction, SystemProgram, sendAndConfirmTransaction} = require('@solana/web3.js');
const borsh = require('borsh');
const lib = require('./lib');

const args = process.argv.slice(2);

const connection = new Connection('http://localhost:8899');
const accountSeed = new TextEncoder().encode(args[0], "utf8");
const accountValue = new TextEncoder().encode(args[1], "utf8");


class SetIx {
    ix = 1;
    key;
    value;

    constructor(key, value) {
        // let keyList = [];
        // for (let elem of key) {
        //     keyList = keyList.concat([elem])
        // }
        //
        // let valueList = [];
        // for (let elem of value) {
        //     valueList = valueList.concat([elem])
        // }
        this.key = key;
        this.value = value;
    }
}

const ixScheme = new Map([
    [
        SetIx, {
        kind: 'struct',
        fields: [
            ['ix', 'u8'],
            ['key', ['u8']],
            ['value', ['u8']],
        ],
    }
    ]
]);

const serialize = (key, data) => {
    const ixData = new SetIx(key, data);
    return borsh.serialize(ixScheme, ixData);
}

const setAccountPDA = (programId) => {
    let formattedSeed;
    if (accountSeed.length > 16) {
        let first  = accountSeed.slice(0, 16);
        let second = accountSeed.slice(16);
        formattedSeed = [first, second]
    }else {
        formattedSeed = [accountSeed];
    }

    let pda = PublicKey.findProgramAddressSync(formattedSeed, programId);
    return pda[0];
}

const createSet = (feePayer, pda, buffer, programId) => {
    return new TransactionInstruction({
        keys: [
            { pubkey: feePayer.publicKey, isSigner: true, isWritable: false},
            { pubkey: pda, isSigner: false, isWritable: true},
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        data: buffer,
        programId: programId,
    });
}

const set = async () => {
    const programId = lib.readKeyPair('programId').publicKey;
    const feePayer = lib.readKeyPair('feePayer');
    const tx = new Transaction();
    let signers = [feePayer];

    const dataPDA = setAccountPDA(programId);
    const ix = serialize(accountSeed, accountValue);

    const logger = connection.onLogs(programId, (log) => {
        lib.parseLogs(log);
    }, "confirmed");

    tx.add(createSet(feePayer, dataPDA, ix, programId));

    const hash = await sendAndConfirmTransaction(connection, tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });

    console.log(hash);
}

set();