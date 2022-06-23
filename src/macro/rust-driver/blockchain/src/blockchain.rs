use chrono::{DateTime, Utc};
use solana_program::clock::Slot;
use solana_transaction_status::EncodedTransactionWithStatusMeta;
use crate::solana::driver::Solana;

pub trait BlockChain {
    type Object;

    fn get_tip(&self) -> u64;

    fn poll_transaction_by_block(&self, block_number: u64) -> Option<Vec<EncodedTransactionWithStatusMeta>>;
}

#[derive(Debug)]
pub enum TransactionInfo {
    Started(DateTime<Utc>),
    Ended(DateTime<Utc>, DateTime<Utc>, Slot, bool),
}