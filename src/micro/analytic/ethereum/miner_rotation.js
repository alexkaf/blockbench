const Web3 = require('web3');
const fs = require("fs");

const file = process.argv[2];

let web3 = new Web3();
web3.setProvider(new Web3.providers.WebsocketProvider('ws://10.0.1.33:8546'));

// fs.appendFileSync(file, 'Block Number, TxCount, Datetime');
let miners = {};

const monitor = async () => {
    const subscription = web3.eth.subscribe('newBlockHeaders', async (_, data) => {
        if (Object.keys(miners).includes(data.miner)) {
            miners[data.miner] += 1;
        } else {
            miners[data.miner] = 1;
        }

        console.log(miners);
    })
}

monitor();