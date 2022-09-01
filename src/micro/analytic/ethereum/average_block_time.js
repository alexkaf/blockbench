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

const averageFromFirstBlock = async() => {
    let currentIdx = 0;
    let timestamps = [];

    while (true) {
        try {
            let blockContents = await web3.eth.getBlock(currentIdx++);
            timestamps.push(blockContents.timestamp);
        } catch (_) {
            break;
        }
    }
    let blockTimes = [];
    
    for (let idx=1; idx<currentIdx - 2; idx++) {
        blockTimes.push(timestamps[idx + 1] - timestamps[idx]);
    }

    console.log(blockTimes);
    console.log(`Average of ${currentIdx - 1} blocks: ${average(blockTimes)}s`);
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

averageFromFirstBlock();
// monitor();