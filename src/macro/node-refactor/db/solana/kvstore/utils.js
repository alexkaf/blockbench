const {
    PublicKey
} = require('@solana/web3.js');

const createPda = (data, programId) => {
    return PublicKey.findProgramAddressSync([
        new TextEncoder().encode(data.key),
    ], programId)[0];
}

module.exports = {
    create_pda: createPda,
}