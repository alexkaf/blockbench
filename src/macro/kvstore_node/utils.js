const kFNVOffsetBasis64 = 0xCBF29CE484222325;
const kFNVPrime64 = 1099511628211;

const FVNHash64 = (val) => {
    let hash = kFNVOffsetBasis64;

    for (let i = 0; i < 8; i += 1) {
        const octet = val & 0x00f;
        val = val >> 8;
        hash = hash ^ octet;
        hash = hash * kFNVPrime64;
    }

    return hash;
}

const RandomPrintChar = () => {
    const random = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER));
    return random % 94 + 33;
}

module.exports = {
    FVNHash64: FVNHash64,
    Hash: FVNHash64,
    RandomPrintChar: RandomPrintChar,
}