const { parser } = require('./parser.js');
const eth = require('./eth.js');

const argsObject = parser();

const p = eth.getProvider(argsObject["endpoint"]);
console.log(p.eth.getBlockNumber());