const { parser } = require('./parser.js');
const eth = require('./eth.js');

const argsObject = parser();

const p = eth.getProvider(argsObject["endpoint"][0]);
console.log(p.eth.getBlockNumber());