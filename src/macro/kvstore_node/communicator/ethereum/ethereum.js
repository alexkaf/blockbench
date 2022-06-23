const Web3 = require('web3');
const defaults = require('./defaults');
const utils = require('./utils');

class EthereumCommunicatorDb {
    endpoint; // endpoint for the cluster
    connection; // cluster connection
    programId;
    contractPath;
    contract;
    feePayer;
    deployedContractAddress
    account;
    contractData;
    compiledPath;
    currentDirectory = __dirname;

    constructor(endpoint){
        this.endpoint = endpoint;
        this.connection = new Web3(endpoint);
    }

    async init() {
        await this.#setAccount();
    }

    async deploy() {
        console.log(`Deploying ${this.contract}...`);
        this.contractData = utils.readContract(this.contract);
        const contract = new this.connection.eth.Contract(this.contractData.abi);
        const meta = {
            from: this.account,
            gas: defaults.value_1Eth,
            gasPrice: defaults.value_10Gwei,
        };
        this.deployedContract = (await contract.deploy({
            data: this.contractData.bytecode,
        }).send(meta, (err, res) => {
            // return res
        }));
        this.deployedContractAddress = this.deployedContract._address;

        console.log(`Deployed ${this.contract}`);
    }

    async #setAccount () {
        this.account = (await this.connection.eth.personal.getAccounts())[0];
    }
}

module.exports = {
    Blockchain: EthereumCommunicatorDb,
};