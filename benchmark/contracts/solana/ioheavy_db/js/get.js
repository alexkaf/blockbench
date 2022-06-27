const { PublicKey, Transaction, Connection, TransactionInstruction, SystemProgram, sendAndConfirmTransaction} = require('@solana/web3.js');
const borsh = require('borsh');
const lib = require('./lib');

const args = process.argv.slice(2);

const connection = new Connection('http://localhost:8899');
const accountSeed = new TextEncoder().encode(args[0], "utf8");


class GetIx {
    ix = 0;
}

const ixScheme = new Map([
    [
        GetIx, {
            kind: 'struct',
            fields: [
                ['ix', 'u8'],
            ],
        }
    ]
]);

const serialize = () => {
    const ixData = new GetIx();
    return borsh.serialize(ixScheme, ixData);
}

const getAccountPDA = (programId) => {
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

const createGet = (feePayer, pda, buffer, programId) => {
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

const get = async () => {
    const programId = lib.readKeyPair('programId').publicKey;
    const feePayer = lib.readKeyPair('feePayer');
    const tx = new Transaction();
    let signers = [feePayer];

    const dataPDA = getAccountPDA(programId);
    const ix = serialize();

    tx.add(createGet(feePayer, dataPDA, ix, programId));

    const logger = connection.onLogs(programId, (log) => {
        lib.parseLogs(log);
    }, "confirmed");

    const hash = await sendAndConfirmTransaction(connection, tx, signers, {
        skipPreflight: true,
        commitment: "confirmed",
        preflightCommitment: "confirmed",
    });

    console.log(hash);
}

get();