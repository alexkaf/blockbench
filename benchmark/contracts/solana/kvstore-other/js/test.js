const lib = require('./instructions/lib');
const {
    PublicKey,
    SystemProgram,
    Connection,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
} = require("@solana/web3.js");


const connection = new Connection('http://localhost:8899/');

const createAccount = async (feePayer, pda, programId) => {
    return SystemProgram.createAccount({
        fromPubkey: feePayer.publicKey,
        newAccountPubkey: pda.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(100),
        space: 100,
        programId: programId,
    });
}

const main = async () => {
    const programId = new PublicKey(process.argv[2]);
    const feePayer = new Keypair();
    const tx = new Transaction();

    await connection.requestAirdrop(feePayer.publicKey, 100e9);

    const pda = lib.createPda({
        key: 'Alex',
    }, programId);
    console.log(pda)
    tx.add(await createAccount(feePayer, pda, programId));

    const signers = [feePayer, pda];

    const txId = await sendAndConfirmTransaction(connection, tx, signers, {
        skipPreflight: true,
        preflightCommitment: "confirmed",
        commitment: "confirmed"
    });
    console.log(txId);

    const pdaInfo = await connection.getAccountInfo(pda);
    console.log(pdaInfo)
}

main()
