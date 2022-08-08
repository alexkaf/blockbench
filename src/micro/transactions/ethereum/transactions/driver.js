const { parser } = require('./parser.js');
const eth = require('./eth.js');

const p = eth.getProvider('localhost');
console.log(p.eth.getBlockNumber());