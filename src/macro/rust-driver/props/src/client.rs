use std::cell::RefCell;
use std::rc::Rc;
use blockchain_driver::solana::driver::Solana;
use generator::discrete::Operation;
use crate::workload::Workload;
use utils::Pair;

pub struct Client {
    db_: Rc<RefCell<Solana>>,
    workload_: Rc<RefCell<Workload>>,
}

impl Client {
    pub fn new(db: Rc<RefCell<Solana>>, wl: Rc<RefCell<Workload>>) -> Client {
        Client {
            db_: db,
            workload_: wl,
        }
    }

    pub fn do_transaction(&self) -> Result<bool, ()>{
        let mut status= 10;
        let next_operation = self.workload_.borrow_mut().next_operation();
        match next_operation {
            Operation::Read => {
                status = self.transaction_read().unwrap();
            }
            Operation::Update => {
                status = self.transaction_update().unwrap();
            }
            Operation::Insert => {
                status = self.transaction_update().unwrap();
            }
            Operation::ReadModifyWrite => {
                status = self.transaction_read_modify_write().unwrap();
            }
            _ => {
                return Err(());
            }
        }
        Ok(status == 0)
    }

    pub fn do_insert(&self) -> Result<u8, ()> {
        let key = self.workload_.borrow_mut().next_sequence_key();
        let mut values = Vec::<Pair>::new();
        self.workload_.borrow_mut().build_values(&mut values);
        self.db_.borrow().set(&key, &mut values)

    }

    pub fn transaction_read(&self) -> Result<u8, ()> {
        let key = self.workload_.borrow_mut().next_transaction_key();
        self.db_.borrow().read(&key[..])
    }

    pub fn transaction_read_modify_write(&self) -> Result<u8, ()> {
        let mut workload = self.workload_.borrow_mut();
        let mut db = self.db_.borrow();

        let key = workload.next_transaction_key();

        db.read(&key[..]);

        let mut values = Vec::<Pair>::new();
        if workload.write_all_fields() {
            workload.build_values(&mut values);
        } else {
            workload.build_update(&mut values);
        }
        db.set(&key[..], &values)
    }

    pub fn transaction_scan(&self) -> Result<u8, ()> {
        Ok(0)
    }

    pub fn transaction_update(&self) -> Result<u8, ()> {
        let mut workload = self.workload_.borrow_mut();
        let key = workload.next_transaction_key();

        let mut values = Vec::<Pair>::new();
        if workload.write_all_fields() {
            workload.build_values(&mut values);
        }else {
            workload.build_update(&mut values);
        }
        self.db_.borrow().set(&key[..], &values)
    }

    pub fn transaction_insert(&self) -> Result<u8, ()> {
        let mut workload = self.workload_.borrow_mut();

        let key = workload.next_transaction_key();
        let mut values = Vec::<Pair>::new();
        workload.build_values(&mut values);
        self.db_.borrow().set(&key[..], &values)
    }
}