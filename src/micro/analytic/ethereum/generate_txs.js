const Web3 = require('web3');
const fs = require("fs");
const BN = require('bn.js');


let account_idx = parseInt(process.env.ACCOUNT_IDX);

const tx_cnt = parseInt(process.argv[2]);
const endpoints = process.argv.slice(4);

let providers = []

for (let endpoint of endpoints) {
    const web3 = new Web3();
    web3.setProvider(`http://${endpoint}`);
    providers.push(web3);
}

// const loadAccounts = async() => {
//     let to_return = [];
//     let accounts = await web3.eth.personal.getAccounts();
//     for (let account of accounts) {
//         console.log(account)
//         await web3.eth.personal.unlockAccount(account);
//         to_return.push({
//             publicKey: account,
//            nonce: await web3.eth.getTransactionCount(account),
//         });
//     }
//     return to_return;
// }
const loadAccounts = async () => {
    let contents = fs.readFileSync('accounts', "utf-8");
    let accounts = [];

    let temp_accounts = contents
        .split('\n')
        .filter(line => {
            return line !== ''
        })
        .map((pair => pair.split(', ')));

    for (let pair of temp_accounts) {

        let nonce = await providers[0].eth.getTransactionCount(pair[0]);
        console.log(nonce)
        accounts.push({
            publicKey: pair[0],
            privateKey: pair[1],
            nonce: nonce,
        })
    }
    return accounts
}

const execTxs = async (accounts, txn_cnt) => {
    let from, to, amount, txn, provider;
    let transactions = [];
    const accountLen = accounts.length;
    while(txn_cnt > 0) {
        console.log(txn_cnt);
        from = Math.floor(Math.random() * accountLen);
        to = Math.floor(Math.random() * accountLen);
        amount = Math.floor(Math.random() * 1000000 + 1);
        provider = account_idx;

        txn = {
            from: accounts[from].publicKey,
            to: accounts[from].publicKey,
            value: new BN(amount),
            gas: new BN('0x6000'),
            gasPrice: new BN('0'),
            nonce: accounts[from].nonce,
        };
        accounts[from].nonce += 1;

        txn = await providers[provider].eth.accounts.signTransaction(txn, accounts[from].privateKey);
        // console.log(txn.rawTransaction)
        transactions.push(providers[provider].eth.sendSignedTransaction(txn.rawTransaction));

        txn_cnt -= 1;
    }

    console.log('Waiting for transactions...');
    await Promise.all(transactions);
    let minBlockNumber = 100000;
    let maxBlockNumber = -1;
    for (let tx of transactions) {
        tx = await tx;
        if (tx.blockNumber < minBlockNumber) minBlockNumber = tx.blockNumber;
        if (tx.blockNumber > maxBlockNumber) maxBlockNumber = tx.blockNumber;
    }
    console.log(`First: ${minBlockNumber}`);
    console.log(`Last: ${maxBlockNumber}`);
    console.log('Done')
}
// const createAccounts = (account_cnt) => {
//     let accounts = [];
//     while (account_cnt > 0) {
//         accounts.push(web3.eth.accounts.create());
//         account_cnt -= 1;
//     }
//     return accounts;
// }

// (async () => {
//     let acc = await web3.eth.personal.getAccounts();
//     console.log(acc)
// })();
//
(async () => {
    const accounts = await loadAccounts();
    console.log(accounts)
    await execTxs(accounts, tx_cnt);
})();


// execTxs(accounts, tx_cnt);


