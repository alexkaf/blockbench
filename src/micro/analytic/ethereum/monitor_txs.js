const Web3 = require('web3');
const fs = require("fs");

const fileName = process.argv[3];

const txsPerBlock = `${fileName}_txsPerBlock`;
const txsPerSecond = `${fileName}_txsPerSecond`;

const web3 = new Web3();
web3.setProvider(`ws://${process.argv[2]}:8546`);

const monitor = async () => {
    let txs = 0;
    let blockContents;
    let blockNumber;
    const subscriber = web3.eth.subscribe('newBlockHeaders', async (_, data) => {
        try {
            blockNumber = data.number;
            blockContents = await web3.eth.getBlock(blockNumber);
            txs += blockContents.transactions.length;
            console.log(`[${blockNumber}]: ${blockContents.transactions.length}`);
            fs.appendFileSync(txsPerBlock, `${blockNumber}, ${blockContents.transactions.length}\n`);
        } catch (_) {}
    });

    setInterval(() => {
        console.log(`[${blockNumber}]: ${txs}/sec`);
        fs.appendFileSync(txsPerSecond, `${blockNumber}, ${txs}, ${Date.now()}\n`);
        txs = 0;
    }, 1000);
}

monitor();