const {
    Connection, PublicKey, Keypair,
} = require('@solana/web3.js');
const instruction = require('./instructions');
const fs = require('fs');

const connection = new Connection('http://localhost:8899/');

const readSK = (filename) => {
    const contents = fs.readFileSync(`./${filename}`, 'utf8').slice(1, -1);
    const array = contents
        .split(',')
        .map((elem) => parseInt(elem));
    return Keypair.fromSecretKey(new Uint8Array(array));
}

const processArgs = () => {
    let ix_data;
    const args = process.argv.slice(2);
    const pId = new PublicKey(args[0]);
    const feePayer = readSK(args[1]);
    const ix = args[2];

    switch (ix) {
        case 'log' : {
            ix_data = {
                'msg': args[3],
            };
            break;
        }
        case 'set': {
            ix_data = {
                'key': args[3],
                'value': args[4],
            };
            break;
        }
        case 'get': {
            ix_data = {
                'key': args[3],
            };
            break;
        }
        default : {
            ix_data = {};
            break;
        }
    }

    return {
        programId: pId,
        ix: ix,
        feePayer: feePayer,
        data: ix_data,
    };
}

const main = async () => {
    const args = processArgs();
    switch (args.ix) {
        case 'log': {
            await instruction.log(connection, args.feePayer, args.programId, args.data.msg);
            break;
        }
        case 'set': {
            await instruction.set(connection, args.feePayer, args.programId, args.data)
            break;
        }
        case 'get': {
            await instruction.get(connection, args.feePayer, args.programId, args.data);
            break;
        }
    }
};

main();