const { parser } = require('./parser.js');
const eth = require('./eth.js');

const argsObject = parser();

const ws = eth.getWsProvider(argsObject.endpoint);
const http = eth.getHttpProvider(argsObject.endpoint);

console.log(`Keypairs: ${argsObject.keypairs}`);
console.log(`Transactions: ${argsObject.totalTxs}`);
console.log(`Transactions for current: ${argsObject.txs}`);
console.log(`Rate: ${argsObject.rate}`);

(async() => {
    const accounts = await eth.createAccounts(http, ws, argsObject.keypairs);
    
    // await eth.startBenchmark(accounts, argsObject);
})();
