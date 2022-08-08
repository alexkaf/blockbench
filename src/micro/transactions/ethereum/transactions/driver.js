const { parser } = require('./parser.js');
const eth = require('./eth.js');

const argsObject = parser();

const p = eth.getProvider(argsObject["endpoint"][0]);

(async() => {
    console.log(await p.eth.getBlockNumber());
    console.log(await p.eth.collectAccounts(p));
})();
