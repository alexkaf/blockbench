const Properties = require("./core/properties").Properties;
const parseCommandLine = require('./parseCommandLine').parseCommandLine;
const { DBFactory } = require('./db/dbFactory');
const { CoreWorkload } = require('./core/core_workload');
const { Client } = require('./core/client');
const fs = require('fs');
const utils = require('./core/utils');
const moment = require('moment');
const {sleep} = require("./core/utils");

let pendingtx = {};

const DelegateClient = async (db, wl, num_ops, is_loading, txrate) => {
    let client = new Client(db, wl);
    let oks = 0;
    const tx_sleep_time = 1 / txrate;
    let prev = Date.now();
    let next;
    for (let i = 0; i < num_ops; i += 1) {
        if (is_loading) {
            client.DoInsert().then((res) => {
                oks += 1;
                if (oks % 100 === 0) {
                    // console.log(oks / 1000)
                    next = Date.now()
                    console.log(`${(next - prev) / 1000}s`);
                    prev = next;
                }
            });
        } else {
            client.DoTransaction().then((res) => {
                oks += res;
            });
        }
        await utils.sleep(tx_sleep_time);
    }
}

const StatusThread = async (db, dbname, txrate, total_ops) => {
    // let current_txs = 0;
    // let prev_txs_count = 0;
    // let interval = setInterval(() => {
    //     current_txs = Object.keys(pendingtx);
    //     console.log(current_txs.length)
    //     if (current_txs.length >= total_ops) {
    //         console.log('Finished');
    //         Object.keys(pendingtx).map((key) => {
    //             const records = pendingtx[key];
    //             fs.appendFileSync(`results-${dbname}-${total_ops}total-${txrate}persec`, `${records.block}, ${records.end_time - records.start_time}, ${records.hash},  ${records.start_time.getHours()}:${records.start_time.getMinutes()}:${records.start_time.getSeconds()}:${records.start_time.getMilliseconds()}, ${records.end_time.getHours()}:${records.end_time.getMinutes()}:${records.end_time.getSeconds()}:${records.end_time.getMilliseconds()}\n`)
    //         });
    //         clearInterval(interval);
    //     }
    //     else {
    //         if (current_txs.length > prev_txs_count) {
    //             console.log(`Finished transactions: ${current_txs.length}`);
    //             prev_txs_count = current_txs.length;
    //         }
    //     }
    // }, 1000);
    let current_txs = 0;
    let prev_txs_count = 0;
    let interval = setInterval(async () => {
        current_txs = Object.keys(pendingtx).length;
        if (current_txs >= total_ops) {
           console.log('DONE');
           clearInterval(interval);
           await scanForEndTime(db);
        }  else if (current_txs > prev_txs_count) {
            console.log('Current transactions:', current_txs);
        }
    }, 1000);
}

const scanForEndTime = async (db) => {
    let reps = 0;
    let start_time, end_time;
    let block;

    Object.keys(pendingtx).map(async (hash) => {
        start_time = pendingtx[hash]['start_time'];
        while (true) {
            block = await db.connection.getTransaction(hash);
            if (block !== null) break;
            // console.log(`${reps}: Retrying for`, hash)
            reps += 1
            await utils.sleep(0.5);
        }
        reps = 0;
        // end_time = new Date(block.blockTime).toLocaleTimeString();
        // console.log(start_time, end_time);
        end_time = moment.unix(block.blockTime).format('mm:ss');
        const startTime = `${start_time.getMinutes()}:${start_time.getSeconds()}:${start_time.getMilliseconds()}`;
        console.log(`${hash}: ${startTime}, ${end_time}:00`)
    })
}

const main = async () => {
    let props = new Properties();

    let filename = parseCommandLine(props);

    let db = new DBFactory().CreateDB(props);
    await db.Init(pendingtx);

    const tip = await db.getTip();
    console.log('Current tip: ', tip);
    let wl = new CoreWorkload();
    wl.Init(props);
    const num_threads = props.GetProperty('threadcount', 1);
    const txrate = props.GetProperty('txrate', 10);

    let total_ops = props.GetProperty('recordcount');

    for (let idx = 0; idx < num_threads; idx += 1){
        DelegateClient(db, wl, Math.floor(total_ops / num_threads), true, txrate);
    }
    StatusThread(db, props.GetProperty('dbname'), txrate, total_ops);

}

main()
