const Web3 = require('web3');
const BN = require('bn.js');
const fs = require('fs');

const resultsFile = '/home/ubuntu/test.txt';

const getWsProvider = (endpoint) => {
    return new Web3(new Web3.providers.WebsocketProvider(`ws://${endpoint}:8546`));
}

const getHttpProvider = (endpoint) => {
    return new Web3(new Web3.providers.HttpProvider(`http://${endpoint}:8545`));
}

const collectAccounts = async (provider) => {
    return provider.eth.personal.getAccounts();
}

const createAccounts = async(provider, numberOfKeypairs) => {
    console.log(`Creating ${numberOfKeypairs} accounts...`);
    const accounts = [];
    
    let accountCreations = [];
    for (let idx=0; idx<numberOfKeypairs; idx++){
        accountCreations.push(provider.eth.personal.newAccount(''));
    }

    await Promise.all(accountCreations);

    await unlockAccounts(provider, numberOfKeypairs);
    await airdropAll(provider, numberOfKeypairs);

    return await collectNonces(provider, numberOfKeypairs);
}

const collectNonces = async (provider, numberOfKeypairs) => {
    let accountNonces = {};
    const accounts = await getAccountsToUse(provider, numberOfKeypairs);

    accountNonces[await getBasicAccount(provider)] = await provider.eth.getTransactionCount(await getBasicAccount(provider));

    for (let account of accounts) {
        accountNonces[account] = await provider.eth.getTransactionCount(account);
    }
    
    return accountNonces;
}

const unlockAccounts = async  (provider, numberOfKeypairs) => {
    console.log(`Unlocking ${numberOfKeypairs} accounts...`);

    const accountsToUnlock = await getAccountsToUse(provider, numberOfKeypairs);

    const pendingUnlocks = accountsToUnlock.map((account) => {
        provider.eth.personal.unlockAccount(account, '', 99999);
    });

    await Promise.all(pendingUnlocks);

    console.log('Accounts unlocked.');
    return accountsToUnlock;
}

const getBasicAccount = async (provider) => {
    return (await provider.eth.personal.getAccounts())[0];
}

const getAccountsToUse = async (provider, numberOfKeypairs) => {
    const accounts = await provider.eth.personal.getAccounts();

    const allAccountsLength = accounts.length;
    const startingIndex = allAccountsLength - numberOfKeypairs;

    return accounts.slice(startingIndex);
}

const airdropAll = async (provider, numberOfKeypairs) => {
    console.log('Airdropping..');

    const basicAccount = await getBasicAccount(provider);
    const accountsToAirdrop = await getAccountsToUse(provider, numberOfKeypairs);
    
    const basicAccountBalance = await provider.eth.getBalance(basicAccount);

    const balancePerAccount = new BN(basicAccountBalance).div(new BN(numberOfKeypairs + 1));

    const airdrops = accountsToAirdrop.map((account) => {
        return provider.eth.sendTransaction({
            from: basicAccount,
            to: account,
            value: balancePerAccount,
        });;
    });

    await Promise.all(airdrops);
    return accountsToAirdrop;
}

const startBenchmark = async (provider, accounts, args) => {
    const txsCount = args.txs;
    const allNodeTxs = args.totalTxs;
    const msPerTx = 1000 / args.rate;

    let pendingTxs = {};
    const txsToExecute = generateTxs(accounts, txsCount);
    monitorTxs(provider , pendingTxs, txsCount, allNodeTxs);

    const startTime = Date.now();
    fs.appendFileSync(resultsFile, `Start, ${startTime * 1e6}\n`);

    console.log('Started benchmark');
    let idx = 0;
    for (let tx of txsToExecute) {
        provider.eth.sendTransaction(tx).on('transactionHash', (hash) => {
            pendingTxs[hash] = Date.now();
        });

        await sleep(msPerTx);
    }

    console.log(`Sent ${txsCount} txs`);
}

const monitorTxs = async (wsProvider, pendingTxs, totalTxs, allNodeTxs) => {
    let allTxsDone = 0;
    let blockFindTime = {};
    let currentBlockIdx = await wsProvider.eth.getBlockNumber();
    let alreadyInside = false;

    const monitor = wsProvider.eth.subscribe('newBlockHeaders', async (_, data) => {
        const blockNumber = data.number;
        const currentBlockContents = await wsProvider.eth.getBlock(blockNumber);
        allTxsDone += currentBlockContents.transactions.length;
        blockFindTime[blockNumber] = Date.now();

        console.log(`[${blockNumber}]: ${allTxsDone} / ${allNodeTxs}  |  ${currentBlockContents.transactions.length}`);
    });

    // setInterval(async () => {
    //     if (alreadyInside) {
    //         console.log('Already in...');
    //         return;
    //     }

    //     let newBlock = await wsProvider.eth.getBlockNumber();
        
    //     console.log(currentBlockIdx + 1, newBlock);
    //     for (let blockIdx = currentBlockIdx + 1; blockIdx <= newBlock; blockIdx++){
            
    //         alreadyInside = true;

    //         const currentBlock = await wsProvider.eth.getBlock(blockIdx);
    //         const blockTxs = currentBlock.transactions;
    //         const currentTime = Date.now();

    //         let txsFound = 0;
    //         blockTxs.forEach((tx) => {
    //             if (pendingTxs[tx] != undefined) {
    //                 txsFound += 1;
                    
    //                 const timeSpent = currentTime - pendingTxs[tx];
    //                 const toWrite = `${blockIdx}, ${tx}, ${timeSpent * 1e6}\n`;

    //                 fs.appendFileSync(resultsFile, toWrite);

    //                 delete pendingTxs[tx];
    //             }
    //         });
    //         allTxsDone += txsFound;

    //         console.log(`[${blockIdx}]: ${txsFound} txs`);

    //         if (allTxsDone == totalTxs) {
    //             const endTime = Date.now();
    //             fs.appendFileSync(resultsFile, `End, ${endTime * 1e6}\n`);
    //             console.log('DONE');
                
    //             process.exit(0);
    //         }
    //     }
    //     alreadyInside = false;
    //     console.log('Next first block: ', newBlock);
    //     currentBlockIdx = newBlock;
    // }, 1000);
    // wsProvider.eth.subscribe('newBlockHeaders', async (_, data) => {
    //     const currentBlock = await wsProvider.eth.getBlock(data.number);
    //     const blockTxs = currentBlock.transactions;
    //     const currentTime = Date.now();

    //     let txsFound = 0;
    //     blockTxs.forEach((tx) => {
    //         if (pendingTxs[tx] != undefined) {
    //             txsFound += 1;
                
    //             const timeSpent = currentTime - pendingTxs[tx];
    //             const toWrite = `${data.number}, ${tx}, ${timeSpent * 1e6}\n`;

    //             fs.appendFileSync(resultsFile, toWrite);

    //             delete pendingTxs[tx];
    //         }
    //     });
    //     allTxsDone += txsFound;

    //     console.log(`[${data.number}]: ${txsFound} txs`);

    //     if (allTxsDone == totalTxs) {
    //         const endTime = Date.now();
    //         fs.appendFileSync(resultsFile, `End, ${endTime * 1e6}\n`);
    //         console.log('DONE');
            
    //         process.exit(0);
    //     }
    // });
}   

const sleep = async (sleepTime) => {
    return new Promise((resolve) => {
        setTimeout(resolve, sleepTime);
    });    
}


const generateTxs = (accounts, numberOfTransactions) => {
    console.log(`Generating ${numberOfTransactions} transactions...`);
    let transactionsToBeExecuted =  [];

    for (let i = 0; i < numberOfTransactions; i++) {
        transactionsToBeExecuted.push(generateSingleTransaction(accounts));
    }

    return transactionsToBeExecuted;
}

const getRandomAmountToTransfer = () => {
    return Math.floor(Math.random() * 1e6);
}

const generateSingleTransaction = (accounts) => {
    const accountsForTx = getAccountsForTransaction(accounts);
    const txValue = getRandomAmountToTransfer();

    return {
        from: accountsForTx[0],
        to: accountsForTx[1],
        nonce: accounts[accountsForTx[0]]++,
        value: txValue
    };;
}

const getAccountsForTransaction = (accounts) => {    
    const accountAddresses = Object.keys(accounts);
    const numberOfAccounts = accountAddresses.length;
    
    const fromAccountIdx = getRandomAccountIdx(numberOfAccounts);

    while (true) {
        const toAccountIdx = getRandomAccountIdx(numberOfAccounts);
        if (toAccountIdx != fromAccountIdx) {
            return [
                accountAddresses[fromAccountIdx],
                accountAddresses[toAccountIdx],
            ];
        }
    }
}

const getRandomAccountIdx = (numberOfKeypairs) => {
    return Math.floor(Math.random() * numberOfKeypairs);
}


module.exports = {
    getWsProvider: getWsProvider,
    getHttpProvider: getHttpProvider,
    collectAccounts: collectAccounts,
    createAccounts: createAccounts,
    airdropAll: airdropAll,
    startBenchmark: startBenchmark,
}
