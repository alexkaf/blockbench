const Web3 = require('web3');
const BN = require('bn.js');
const fs = require('fs');
const { Console } = require('console');

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

        const balancePerAccount = new BN(basicAccountBalance).div(new BN(100));
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

    const startTime = Date.now();
    const resultsFile = `/home/ubuntu/test_${args.name}.txt`;
    fs.writeFileSync(resultsFile, `Start, ${startTime * 1e6}\n`);
    monitorTxs(accounts, pendingTxs, txsCount, allNodeTxs, resultsFile);

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

const findTxTimes = async (accounts, pendingTxs, blockFindTime, resultsFile) => {
    const blockNumbers = Object.keys(blockFindTime);
    const firstAccount = Object.keys(accounts)[0];

    for (let block of blockNumbers) {
        const blockTransactions = (await accounts[firstAccount].httpProvider.eth.getBlock(block)).transactions;
        
        for (let tx of blockTransactions) {
            if (pendingTxs[tx] !== undefined) {
                pendingTxs[tx] = blockFindTime[block] - pendingTxs[tx];
                fs.appendFileSync(resultsFile, `${block * 1e6}, ${tx}, ${pendingTxs[tx]}\n`);
            }
        }
    }
    return pendingTxs;
}

const monitorTxs = async (accounts, pendingTxs, totalTxs, allNodeTxs, resultsFile) => {
    let allTxsDone = 0;
    let blockFindTime = {};
    let accountsIdx = 0;

    const allAccounts = Object.keys(accounts);
    const totalNumberOfAccounts = allAccounts.length;

    let prevBlockIdx = await accounts[allAccounts[0]].wsProvider.eth.getBlockNumber();
    
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
        for (let current = prevBlockIdx + 1; current <= currentBlockNumber; current++) {
            const blockTxs = await currentProvider.eth.getBlockTransactionCount(current);
            blockFindTime[currentBlockNumber] = Date.now();
            allTxsDone += blockTxs;

            console.log(`[${currentBlockNumber}]: ${allTxsDone} / ${allNodeTxs}`);
            if (allTxsDone >= allNodeTxs) {
                const endTime = Date.now();
                fs.appendFileSync(resultsFile, `End, ${endTime * 1e6}\n`);
                const findTimes = await findTxTimes(accounts, pendingTxs, blockFindTime, resultsFile);
                
                console.log('Done');
                process.exit(0);
            }
        }
        await sleep(500);
    }
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
    return Math.floor(Math.random() * 1e4);
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
