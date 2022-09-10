const Web3 = require('web3');
const BN = require('bn.js');

const http = new Web3(new Web3.providers.HttpProvider('http://localhost:8545/'));

const getNumberOfAccounts = () => {
    return parseInt(process.argv[2]); 
}

const sleep = async (sleepTime) => {
    return new Promise((resolve) => {
        setTimeout(resolve, sleepTime);
    });    
}

const unlockAccounts = async () => {
    const numberOfAccounts = getNumberOfAccounts();
    const nodeAccounts = await http.eth.personal.getAccounts();
    const accountsToUnlock = nodeAccounts;

    for (let account of accountsToUnlock) {
        console.log(account);
        await http.eth.personal.unlockAccount(account, '', 99999);
        await sleep(4000);
    }

    console.log('Accounts unlocked');
    process.exit(0);
}   

unlockAccounts();