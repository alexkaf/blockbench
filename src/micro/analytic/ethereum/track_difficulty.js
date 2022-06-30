const Web3 = require('web3');
const fs = require("fs");

const fileName = process.argv[3];

let web3 = new Web3();
web3.setProvider(new Web3.providers.WebsocketProvider(process.argv[2]));

const monitor = async () => {
    const currentBlock = await web3.eth.getBlockNumber();

    for (let blockNumber=1; blockNumber <= currentBlock; blockNumber += 1) {
        console.log(blockNumber);
        let block = await web3.eth.getBlock(blockNumber);
        fs.appendFileSync(fileName, `${blockNumber}, ${block.difficulty}\n`);
    }
}

monitor()