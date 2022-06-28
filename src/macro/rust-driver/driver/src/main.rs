use std::cell::RefCell;
use std::rc::Rc;
use std::str::FromStr;
use std::sync::{Arc, Mutex, RwLock};
use std::{thread, time};
use std::collections::HashMap;
use std::fs::File;
use std::thread::sleep;
use std::time::Duration;
use chrono::{DateTime, NaiveDate, NaiveDateTime, Utc};
use solana_sdk::signature::Signature;
use solana_transaction_status::EncodedTransaction::Json;
use solana_transaction_status::{EncodedTransaction, EncodedTransactionWithStatusMeta};
use blockchain_driver::blockchain::{BlockChain, TransactionInfo};
use blockchain_driver::solana::driver::Solana;
use generator::uniform::UniformGenerator;
use properties::client::Client;
use properties::properties::Properties;
use properties::workload::Workload;
use std::io::Write;

struct Wrap<T> {
    value: Rc<RefCell<T>>,
}

unsafe impl Send for Wrap<Solana> {}
unsafe impl Sync for Wrap<Solana> {}

unsafe impl Send for Wrap<Properties> {}
unsafe impl Sync for Wrap<Properties> {}

impl<T> Wrap<T> {
    fn new(value: T) -> Wrap<T> {
        Wrap {
            value: Rc::new(RefCell::new(value))
        }
    }
}

type PendingTransactions = HashMap<String, TransactionInfo>;

fn main() {

    let mut pending_transactions = Arc::new(Mutex::new(PendingTransactions::new()));
    let props = Arc::new(Wrap::<Properties>::new(Properties::parse_command_line_arguments()));
    let workload = Arc::new(props.value.borrow()["workload"].clone());

    let db = Arc::new(Wrap::<Solana>::new(Solana::new(&props.value.borrow()["endpoint"][..], &props.value.borrow()["workload"][..], Arc::clone(&pending_transactions))));

    let current_tip = db.value.borrow().get_tip();
    println!("Current tip: {}", current_tip);

    let now = Utc::now();

    let num_threads = u64::from_str(props.value.borrow().get_property("threadcount", "1")).unwrap();
    let txrate = u64::from_str(props.value.borrow().get_property("txrate", "10")).unwrap();
    let total_ops = u64::from_str(&props.value.borrow()["recordcount"]).unwrap();

    println!("Num threads: {}", num_threads);
    println!("Txrate: {}", txrate);
    println!("Total Ops: {}", total_ops);

    let mut handles = vec![];
    for _ in 0..num_threads {
        let db = Arc::clone(&db);
        let props = Arc::clone(&props);
        let workload = Arc::clone(&workload);
        let handle = thread::spawn(move || {
            match &workload[..] {
                "smallbank" => client_thread(Rc::clone(&db.value), Rc::clone(&props.value), (total_ops / num_threads) as u64, txrate),
                _ => delegate_client(Rc::clone(&db.value), Rc::clone(&props.value), (total_ops / num_threads) as u64, true, txrate),
            }

        });
        handles.push(handle);
    }

    let db = Arc::clone(&db);
    let pending_transactions_arc = Arc::clone(&pending_transactions);
    let props = Arc::clone(&props);
    let status_handle = thread::spawn(move || {
        status_thread(Rc::clone(&db.value) , props, total_ops, pending_transactions_arc);
    });

    for handle in handles {
        handle.join().unwrap();
    }
    // println!("Sent! {}", pending_transactions.lock().unwrap().len());
    status_handle.join().unwrap();
    // println!("{}", (Utc::now() - now).num_milliseconds());
    // println!("{:?}", pending_transactions.lock().unwrap().len());
}

fn delegate_client(db: Rc<RefCell<Solana>>, props: Rc<RefCell<Properties>>, num_ops: u64, is_loading: bool, txrate: u64) {
    let wl = Rc::new(RefCell::new(Workload::new()));
    wl.borrow_mut().init(&props.borrow());
    //
    let client = Client::new(Rc::clone(&db), Rc::clone(&wl));
    let sleep_time = time::Duration::from_millis(1000 / txrate);
    //
    let mut idx = 0;
    for _ in 0..num_ops {
        if is_loading {
            idx += 1;
            client.do_insert();
            sleep(sleep_time);
        } else {
            client.do_transaction();
        }
    }
}

fn client_thread(db: Rc<RefCell<Solana>>, props: Rc<RefCell<Properties>>, num_ops: u64, txrate: u64) {
    let mut op_gen = UniformGenerator::new(1, 6);
    let mut acc_gen = UniformGenerator::new(1, 100000);
    let mut bal_gen = UniformGenerator::new(1, 10);
    let sleep_time = Duration::from_millis(1000 / txrate);

    for _ in 0..num_ops {
        let op = op_gen.next();
        match op {
            1 => {
                db.borrow().almagate(&acc_gen.next().to_string()[..], &acc_gen.next().to_string()[..]);
            }
            2 => {
                db.borrow().get_balance(&acc_gen.next().to_string()[..]);
            }
            3 => {
                db.borrow().update_balance(&acc_gen.next().to_string()[..], bal_gen.next());
            }
            4 => {
                db.borrow().update_saving(&acc_gen.next().to_string()[..], 0);
            }
            5 => {
                db.borrow().send_payment(&acc_gen.next().to_string()[..], &acc_gen.next().to_string()[..], 0);
            }
            6 => {
                db.borrow().write_check(&acc_gen.next().to_string()[..], 0);
            }
            _ => {}
        }
        sleep(sleep_time);
    }
}

fn status_thread(db: Rc<RefCell<Solana>>, props: Arc<Wrap<Properties>>, total_ops: u64, pending_transactions: Arc<Mutex<PendingTransactions>>) {
    let props = props.value.try_borrow().unwrap();
    let file_name = format!("{}_{}_{}_{}", props["dbname"], props["txrate"], props["threadcount"], props["recordcount"]);

    let mut results_file = File::create(file_name).unwrap();

    let mut current_tip = db.borrow().get_tip();
    let mut last_tip = current_tip;

    let mut found = 0u64;
    loop {
        while db.borrow().get_tip() == last_tip {}
        let current_time = Utc::now();
        last_tip += 1;
        let current_block = db.borrow().poll_transaction_by_block(current_tip);
        let mut pending_transactions = pending_transactions.lock().unwrap();
        let mut first_record_time = Utc::now();
        let mut tx_found_in_block = 0;
        match current_block {
            Some(transactions) => {
                for transaction in transactions {
                    if let EncodedTransaction::Json(contents) = transaction.transaction {
                        if pending_transactions.contains_key(&contents.signatures[0]) {
                            tx_found_in_block += 1;
                            if tx_found_in_block == 1 {
                                if let &TransactionInfo::Started(started_at) = pending_transactions.get(&contents.signatures[0]).unwrap() {
                                    first_record_time = started_at;
                                }
                            }
                            found += 1;
                        }
                    }
                }
                results_file.write_all(format!("{:?}, {:?}, {:?}\n", current_tip, tx_found_in_block, current_time.timestamp_millis() - first_record_time.timestamp_millis()).as_bytes());
                println!("[{}]: {}txs", current_tip, found);
                current_tip += 1;
            }
            None => {
                println!("Retry tip");
            }
        }
        if found == pending_transactions.len() as u64 {
            break;
        }
        // sleep(Duration::from_millis(1000));
    }
}
//
// use std::collections::HashMap;
// use std::sync::{Arc, Mutex};
// use solana_sdk::signature::Signature;
// use blockchain_driver::blockchain::{BlockChain, TransactionInfo};
// use blockchain_driver::solana::driver::Solana;
//
//
// fn main() {
//     let mut pending_transactions = Arc::new(Mutex::new(PendingTransactions::new()));
//     let env = Solana::new("http://localhost:8899/", "donothing", pending_transactions);
//     let tip = env.get_tip();
//     env.poll_transaction_by_block(tip);
// }

// use std::sync::Arc;
// use std::thread;
//
// #[derive(Debug)]
// struct Wrap {
//     value: *mut u64
// }
//
// impl Wrap {
//     fn new(value: &mut u64) -> Wrap {
//         Wrap {
//             value: value as *mut u64,
//         }
//     }
//
//     fn increase(&self) {
//         unsafe { *self.value += 1 }
//     }
// }
//
// unsafe impl Send for Wrap {}
// unsafe impl Sync for Wrap {}
//
// fn main() {
//     let mut a: u64 = 0;
//     let mut a = Arc::new(Wrap::new(&mut a));
//     // a.increase();
//     let mut handles = vec![];
//
//     for _ in 0..1000 {
//         let temp = Arc::clone(&a);
//         let handle = thread::spawn(move || unsafe {
//             for _ in 0..10000 {
//                 temp.increase();
//             }
//         });
//         handles.push(handle);
//     }
//
//     for handle in handles {
//         handle.join().unwrap();
//     }
//
//     unsafe { println!("{:?}", *a.value); }
// }