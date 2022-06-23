const {UniformGenerator} = require("./utils/generators");
const {sleep} = require("./utils/utils");
const fs = require("fs");
const ethDB = require('./api_adapters/ethereum/ethDB').EthereumDB;
const solDB = require('./api_adapters/solana/solDB').SolanaDB;
const Properties = require('./utils/properties').Properties;
const parseCommandLine = require('./parseCommandLine').parseCommandLine;

let pending_tx = {};

const  ClientThread = async (sb, num_ops, txrate) => {
    const op_gen = new UniformGenerator(1, 6);
    const acc_gen = new UniformGenerator(1, 100000);
    const bal_gen = new UniformGenerator(1, 10);
    const sleepTime = 1 / txrate;

    for (let i = 0; i < num_ops; i += 1) {
        let op = op_gen.Next();
        switch (op) {
            case 1: {
                sb.Almagate(acc_gen.Next().toString(), acc_gen.Next().toString());
                break;
            }
            case 2: {
                sb.GetBalance(acc_gen.Next().toString());
                break;
            }
            case 3: {
                sb.UpdateBalance(acc_gen.Next().toString(), 0);
                break;
            }
            case 4: {
                sb.UpdateSaving(acc_gen.Next().toString(), 0);
                break;
            }
            case 5: {
                sb.SendPayment(acc_gen.Next().toString(), acc_gen.Next().toString(), 0);
                break;
            }
            case 6: {
                sb.WriteCheck(acc_gen.Next().toString(), 0);
                break;
            }

        }
        await sleep(sleepTime);
    }
}

const StatusThread = (num_ops) => {
    const monitor = setInterval(() => {
        if (Object.keys(pending_tx).length < num_ops) {
            console.log(`${Object.keys(pending_tx).length} / ${num_ops}`);
        }else {
            Object.keys(pending_tx).map((key) => {
                const records = pending_tx[key];
                fs.appendFileSync('resultsAlex', `${records.block}, ${records.end_time - records.start_time}, ${records.hash}\n`)
            });
            console.log('DONE!');
            clearInterval(monitor);
        }
    }, 1000);
}

const CreateDB = (dbname, endpoint) => {
    switch (dbname) {
        case 'ethereum': {
            return new ethDB(endpoint);
        }
        case 'solana': {
            return new solDB(endpoint);
        }
    }
}

const main = async () => {
    let props = new Properties();
    const filename = parseCommandLine(props);
    let sb = CreateDB(props.GetProperty('dbname'), props.GetProperty('endpoint'));
    await sb.Init(pending_tx);
    //
    ClientThread(sb, 100, props.GetProperty('txrate'));
    StatusThread(100)
}

main();