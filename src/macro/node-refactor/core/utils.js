const kFNVOffsetBasis64 = 0xCBF29CE484222325;
const kFNVPrime64 = 1099511628211;

const FNVHash64 = (val) => {
    let hash = kFNVOffsetBasis64;

    for (let i = 0; i < 8; i += 1) {
        let octet = val & 0x00f;
        val = val / Math.pow(2, 8);

        hash = hash ^ octet;
        hash = hash * kFNVPrime64;
    }
    return hash;
}

const RandomDouble = (min = 0.0, max = 1.0) => {
    return Math.random() * (max - min) + min;
}

const RandomPrintChar = () => {
    const randomInt =
        Math.floor(RandomDouble(1, 1e9));
    return randomInt % 94 + 33;
}


const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, Math.ceil(time * 1000)));
};

const timeNow = () => {
    return Date.now();
}



module.exports = {
    sleep: sleep,
    time_now: timeNow,
    RandomDouble: RandomDouble,
    RandomPrintChar: RandomPrintChar,
    FVNHash64: FNVHash64,
    Hash: FNVHash64,
}