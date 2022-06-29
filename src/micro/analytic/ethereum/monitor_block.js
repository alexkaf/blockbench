const Web3 = require('web3');
const fs = require("fs");

const file = process.argv[2];

let web3 = new Web3();
web3.setProvider(new Web3.providers.WebsocketProvider('ws://10.201.252.86:8546'));

fs.appendFileSync(file, 'Block Number, TxCount, Datetime');

const monitor = async () => {
    const subscription = web3.eth.subscribe('newBlockHeaders', async (_, data) => {
        let block = await web3.eth.getBlock(data.number);
        console.log(`${block.number}, ${block.transactions.length}, ${Date.now()}`);
        fs.appendFileSync(file, `${block.number}, ${block.transactions.length}, ${Date.now()}\n`);
    })
}

monitor();