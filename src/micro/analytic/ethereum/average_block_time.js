const Web3 = require('web3');

const endpoint = 'http://localhost:8546/';

const web3 = new Web3();
web3.setProvider(new Web3.providers.WebsocketProvider(endpoint));

let currentTime, previousTime;
let blockTimes = [];
let isFirstBlock = true;

function sum(theList) {
    let sum = 0;
    for (let elem of theList) {
        sum += elem;
    }
    return sum;
}

function average(theList) {
    const sumOfList = sum(theList);
    return sumOfList / theList.length;
}

const averageFromFirstBlock = async(fromBlock) => {
    let startIdx;

    const endIndex = await web3.eth.getBlockNumber();
    if (!isNaN(fromBlock)) {
        startIdx = fromBlock;
    } else {
        startIdx = 1;
    }

    let timestamps = [];
    for (let idx = startIdx; idx < endIndex; idx++) {
        let blockContents = await web3.eth.getBlock(idx);
        timestamps.push(blockContents.timestamp);
    }
    
    const timestampsCount = timestamps.length;
    let blockTimes = [];

    for (let idx = 0; idx < timestampsCount - 1; idx++) {
        blockTimes.push(timestamps[idx + 1] - timestamps[idx]);
    }

    console.log(blockTimes);
    console.log(`Average of last ${timestampsCount} blocks: ${average(blockTimes)}s`);
}

const monitor = async () => {
    let prevTime;
    const subscription = web3.eth.subscribe('newBlockHeaders', async (_, data) => {
        if (isFirstBlock) {
            prevTime = Date.now();
            isFirstBlock = false;
            previousTime = data.timestamp;
            console.log('First block at', data.timestamp);
        } else {            
            let curTime = Date.now();
            currentTime = data.timestamp;
            let blockTime = currentTime - previousTime;
            blockTimes.push(blockTime)
            let averageBlockTime = average(blockTimes);
            previousTime = currentTime;
            console.log(curTime - prevTime);
            prevTime = curTime;
        }    
    })
};

averageFromFirstBlock(parseInt(process.argv[2]));
// monitor();
