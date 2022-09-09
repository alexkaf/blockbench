const Web3 = require('web3');
const BN = require('bn.js');
const fs = require('fs');
const { Console } = require('console');

const resultsFile = '/home/ubuntu/test.txt';

const getWsProvider = (endpoints) => {
    ws = []
    for (let endpoint of endpoints) {
        ws.push(new Web3(new Web3.providers.WebsocketProvider(`ws://${endpoint}:8546`)));
    }
    return ws
}

const getHttpProvider = (endpoints) => {
    http = []
    for (let endpoint of endpoints) {
        http.push(new Web3(new Web3.providers.HttpProvider(`http://${endpoint}:8545`)));
    }
    return http
}

const collectAccounts = async (provider) => {
    return provider.eth.personal.getAccounts();
}

const createAccounts = async(httpProviders, wsProviders, numberOfKeypairs) => {
    console.log(`Creating ${numberOfKeypairs} accounts...`);
    const accounts = [];
    let providerIdx = 0;
    const totalNumberOfProviders = httpProviders.length;
    let accountsPerProvider = {};

    for (let providerIdx = 0; providerIdx < totalNumberOfProviders; providerIdx++) {
        accountsPerProvider[providerIdx] = [];
    }

    let currentProvider;
    for (let idx=0; idx<numberOfKeypairs; idx++){
        let currentProviderIdx = providerIdx++ % totalNumberOfProviders
        currentProvider = httpProviders[currentProviderIdx];
        accountsPerProvider[currentProviderIdx].push(currentProvider.eth.personal.newAccount(''));
    }

    const accountCreations = flattenObjectWithLists(accountsPerProvider);
    await Promise.all(accountCreations);
    await unfoldPromisesFromAccounts(accountsPerProvider);

    let providerPerAccount = createProviderPerAccount(httpProviders, wsProviders, accountsPerProvider);

    await unlockAccounts(providerPerAccount);
    await airdropAll(httpProviders, accountsPerProvider);
    
    providerPerAccount = await collectNonces(providerPerAccount);
    return providerPerAccount;
}

const createProviderPerAccount = (httpProviders, wsProviders, accountsPerProvider) => {
    let providerPerAccount = {};
    const providerKeys = Object.keys(accountsPerProvider);
    
    providerKeys.map((providerKey) => {
        const httpProvider = httpProviders[providerKey];
        const wsProvider = wsProviders[providerKey];
        accountsPerProvider[providerKey].map((account) => {
            providerPerAccount[account] = {
                'httpProvider': httpProvider,
                'wsProvider': wsProvider,
            };
        })
    });
    return providerPerAccount;
}

const unfoldPromisesFromAccounts = async (accountsPerProvider) => {
    const keys = Object.keys(accountsPerProvider);

    for (let key of keys) {
        const accountsLength = accountsPerProvider[key].length;
        
        for (let accountIdx = 0; accountIdx <accountsLength; accountIdx++) {
            accountsPerProvider[key][accountIdx] = await accountsPerProvider[key][accountIdx];
        }
    }
}

const flattenObjectWithLists = (theObject) => {
    const values = Object.values(theObject);

    let listOfValues = [];
    for (let value of values) {
        listOfValues = listOfValues.concat(value);
    }
    return listOfValues;
}

const collectNonces = async (providerPerAccount) => {
    const accounts = Object.keys(providerPerAccount);

    for (let account of accounts) {
        const currentProvider = providerPerAccount[account].httpProvider;
        providerPerAccount[account]['nonce'] = await currentProvider.eth.getTransactionCount(account);
    }
    return providerPerAccount;
}

const unlockAccounts = async  (providerPerAccount) => {
    const accounts = Object.keys(providerPerAccount);
    const numberOfKeypairs = accounts.length;
    console.log(`Unlocking ${numberOfKeypairs} accounts...`);
    
    const pendingUnlocks = accounts.map((account) => {
        const currentProvider = providerPerAccount[account].httpProvider;
        return currentProvider.eth.personal.unlockAccount(account, '', 99999);
    })
    
    await Promise.all(pendingUnlocks);
    console.log('Accounts unlocked.');
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

const airdropAll = async (providers, accountsPerProvider) => {
    console.log('Airdropping..');

    let airdrops = [];
    const providerKeys = Object.keys(accountsPerProvider);

    for (let key of providerKeys) {
        const currentProvider = providers[key];
        const basicAccount = await getBasicAccount(currentProvider);

        const accountsToAirdrop = accountsPerProvider[key];
        const numberOfKeypairs = accountsToAirdrop.length;
        const basicAccountBalance = await currentProvider.eth.getBalance(basicAccount);

        const balancePerAccount = new BN(basicAccountBalance).div(new BN(numberOfKeypairs + 1));
        airdrops = airdrops.concat(accountsToAirdrop.map((account) => {
            return currentProvider.eth.sendTransaction({
                from: basicAccount,
                to: account,
                value: balancePerAccount,
            });
        }));
    }

    await Promise.all(airdrops);
    console.log('Airdrop done...');
}

const startBenchmark = async (accounts, args) => {
    const txsCount = args.txs;
    const allNodeTxs = args.totalTxs;
    const msPerTx = 1000 / args.rate;

    let pendingTxs = {};
    const txsToExecute = generateTxs(accounts, txsCount);
    monitorTxs(accounts, pendingTxs, txsCount, allNodeTxs);

    const startTime = Date.now();
    fs.appendFileSync(resultsFile, `Start, ${startTime * 1e6}\n`);

    console.log('Started benchmark');
    let idx = 0;

    for (let tx of txsToExecute) {
        const currentProvider = tx[0];
        const currentTx = tx[1];
        currentProvider.eth.sendTransaction(currentTx).on('transactionHash', (hash) => {
            pendingTxs[hash] = Date.now();
        });

        await sleep(msPerTx);
    }

    console.log(`Sent ${txsCount} txs`);
}

const monitorTxs = async (accounts, pendingTxs, totalTxs, allNodeTxs) => {
    let allTxsDone = 0;
    let blockFindTime = {};
    let prevBlockIdx;
    let accountsIdx = 0;
    const allAccounts = Object.keys(accounts);
    const totalNumberOfAccounts = allAccounts.length;

    while (true) {
        const currentAccount = allAccounts[accountsIdx++ % totalNumberOfAccounts];
        const currentProvider = accounts[currentAccount].wsProvider;
        const currentBlockNumber = await currentProvider.eth.getBlockNumber();

        if (currentBlockNumber != prevBlockIdx) {
            prevBlockIdx = currentBlockNumber;
        } else {
            await sleep(1000);
            continue;
        }
        const blockTxs = await currentProvider.eth.getBlockTransactionCount(currentBlockNumber);
        allTxsDone += blockTxs;

        console.log(`[${currentBlockNumber}]: ${allTxsDone} / ${totalTxs}`);
        if (allTxsDone >= totalTxs) {
            return;
        }
        await sleep(500);
    }
    // while (true) {
    //     const nextBlockIdx = await wsProvider.eth.getBlockNumber();

    //     console.log(`[${prevBlockIdx}]: Check for ${nextBlockIdx}`);

    //     for (let currentBlockIdx = prevBlockIdx + 1; currentBlockIdx <= nextBlockIdx; currentBlockIdx++) {
    //         console.log('Waiting for block ', currentBlockIdx);
    //         const currentBlockContents = await wsPro vider.eth.getBlock(currentBlockIdx);
    //         console.log('Got block ', currentBlockIdx);

    //         allTxsDone += currentBlockContents.transactions.length;
    //         blockFindTime[currentBlockIdx] = Date.now();

    //         console.log(`[${currentBlockIdx}]: ${allTxsDone} / ${allNodeTxs} | ${currentBlockContents.transactions.length} txs`);
    //     }

    //     if (allTxsDone === totalTxs) {
    //         break;
    //     }
    //     prevBlockIdx = nextBlockIdx;
    //     await sleep(1000);
    // }

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

    return [accounts[accountsForTx[0]].httpProvider, {
        from: accountsForTx[0],
        to: accountsForTx[1],
        nonce: accounts[accountsForTx[0]].nonce++,
        value: txValue
    }];
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
