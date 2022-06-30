const Web3 = require('web3');
const fs = require("fs");

const file = process.argv[3];

let web3 = new Web3();
while (true) {
    try {
        web3.setProvider(new Web3.providers.WebsocketProvider(process.argv[2]));
        break;
    } catch (_) {

    }
}

const monitor = async () => {
    const subscription = web3.eth.subscribe('newBlockHeaders', async (_, data) => {
        let block = await web3.eth.getBlock(data.number);
        console.log(`${block.number}, ${block.transactions.length}, ${block.miner}, ${Date.now()}`);
        fs.appendFileSync(file, `${block.number}, ${block.transactions.length}, ${block.miner}, ${Date.now()}\n`);
    })
}

monitor();