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

const makeAirdrops = async () => {
    const numberOfAccounts = getNumberOfAccounts();
    const nodeAccounts = await http.eth.personal.getAccounts();
    const basicAccount = nodeAccounts[0];
    let balancePerAccount;

    while (true) {
        console.log('Checking balance per account');
        const basicAccountBalance = await http.eth.getBalance(basicAccount);
        balancePerAccount = new BN(basicAccountBalance).div(new BN(100 * (numberOfAccounts + 1)));

        if (balancePerAccount.gt(new BN(1e6))) {
            console.log('Balance Ok');
            break;
        }

        console.log('Not enough', balancePerAccount.toString());
        await sleep(5000);
    }

    const accountsToAirdrop = nodeAccounts.slice(-numberOfAccounts);

    const pendingTransfers = accountsToAirdrop.map((account) => {
        return  http.eth.sendTransaction({
            from: basicAccount,
            to: account, 
            value: balancePerAccount
        });
    });
    
    await Promise.all(pendingTransfers);
    console.log('Accounts airdropped');
    process.exit(0);
}   

makeAirdrops();