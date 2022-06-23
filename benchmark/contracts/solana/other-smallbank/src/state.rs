use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::log::sol_log;
use bigint::U256;

#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct Data {
}

impl Data {
    pub fn unpack(src: &[u8]) -> U256 {
        U256::from_little_endian(src)
    }
}