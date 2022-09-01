const Web3 = require('web3');

const endpoint = 'http://localhost:8546/';

const web3 = new Web3();
web3.setProvider(new Web3.providers.WebsocketProvider(endpoint));

const monitor = async () => {
    let prevTime;
    const subscription = web3.eth.subscribe('newBlockHeaders', async (_, data) => {
        console.log(data.number, data.miner) ;
    })
};

// averageFromFirstBlock();
monitor();