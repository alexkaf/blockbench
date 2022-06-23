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
        case 'almagate' : {
            ix_data = {
                'arg0': args[3],
                'arg1': args[4],
            };
            break;
        }
        case 'getBalance': {
            ix_data = {
                'arg0': args[3],
            };
            break;
        }
        case 'updateBalance': {
            ix_data = {
                'arg0': args[3],
                'arg1': args[4],
            };
            break;
        }
        case 'updateSaving': {
            ix_data = {
                'arg0': args[3],
                'arg1': args[4],
            };
            break;
        }
        case 'sendPayment': {
            ix_data = {
                'arg0': args[3],
                'arg1': args[4],
                'arg2': args[5],
            };
            break;
        }
        case 'writeCheck': {
            ix_data = {
                'arg0': args[3],
                'arg1': args[4],
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
        case 'almagate': {
            await instruction.almagate(connection, args.feePayer, args.data, args.programId);
            break;
        }
        case 'getBalance': {
            await instruction.getBalance(connection, args.feePayer, args.data, args.programId);
            break;
        }
        case 'updateBalance': {
            await instruction.updateBalance(connection, args.feePayer, args.data, args.programId);
            break;
        }
        case 'updateSaving': {
            await instruction.updateSaving(connection, args.feePayer, args.data, args.programId);
            break;
        }
        case 'sendPayment': {
            await instruction.sendPayment(connection, args.feePayer, args.data, args.programId);
            break;
        }
        case 'writeCheck': {
            await instruction.writeCheck(connection, args.feePayer, args.data, args.programId);
            break;
        }
    }
};

main();