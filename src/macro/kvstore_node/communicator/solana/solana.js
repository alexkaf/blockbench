const  {
    Connection, Keypair, PublicKey,
} = require('@solana/web3.js');
const shellExecSync = require('child_process').execSync;
const defaults = require('./defaults');
const keys = require('./keys');

class SolanaCommunicatorDb {
    endpoint; // endpoint for the cluster
    connection; // cluster connection
    programId;
    contractPath;
    contract;
    feePayer;
    compiledPath;
    currentDirectory = __dirname;

    constructor(opts){
        Object.keys(opts).forEach((key) => {
            // initialize parameters
            this[key] = opts[key];
        });
        this.#establishConnection(opts.endpoint);
    }

    async init() {
        await this.createKeys();
    }

    #establishConnection(endpoint) {
        // Establish connection with the cluster
        this.connection = new Connection(endpoint);
    }

    async createKeys() {
        this.feePayer = await keys.createKey(this.connection, 'feePayer');
    }

    compile() {
        console.log(`Compiling ${this.contract}...`);
        process.chdir(this.contractPath);
        const compileOutput = shellExecSync('cargo build-bpf', {
            stdio: 'pipe',
        });
        console.log('Compiled...');
        process.chdir(this.currentDirectory);
    }

    deploy() {
        console.log(`Deploying ${this.contract}...`);
        process.chdir(this.contractPath)
        const programId = shellExecSync(`solana program deploy -k ${defaults.feePayerPath} ${this.compiledPath}`, {
            stdio: 'pipe'
        }).toString().split(' ')[2].trim();
        this.programId = new PublicKey(programId);
        console.log(`Deployed at ${this.programId}`);
        process.chdir(this.currentDirectory);
    }


}

module.exports = {
    Blockchain: SolanaCommunicatorDb,
};