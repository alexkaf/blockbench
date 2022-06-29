const {
    Connection,
} = require('@solana/web3.js');
const fs = require("fs");

const fileName = process.argv[2];

const txsPerBlock = `${fileName}_txsPerBlock`;
const txsPerSecond = `${fileName}_txsPerSecond`;

const connection = new Connection('http://65.21.204.112:8899');

const monitor = async () => {
    let txs = 0;
    let blockContents;
    let blockNumber;
    const subscriber = connection.onSlotChange(async (data) => {
        try {
            blockNumber = data.root - 1;
            blockContents = await connection.getBlock(blockNumber, "confirmed");
            txs += blockContents.transactions.length;
            console.log(`[${blockNumber}]: ${blockContents.transactions.length}`);
            fs.appendFileSync(txsPerBlock, `${blockNumber}, ${blockContents.transactions.length}\n`);
        } catch (_) {}
    });

    setInterval(() => {
        console.log(`[${blockNumber}]: ${txs}/sec`);
        fs.appendFileSync(txsPerSecond, `${blockNumber}, ${txs}\n`);
        txs = 0;
    }, 1000);
}

monitor();