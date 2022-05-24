use std::collections::HashMap;
use std::fmt::format;
use borsh::{BorshSerialize};
use bigint::U256;
use solana_program::{
    entrypoint_deprecated::ProgramResult,
    account_info::{AccountInfo, next_account_info},
    msg,
    log::{sol_log_slice, sol_log},
    program_error::ProgramError,
};
use crate::instruction::Instruction;
use crate::bytes20::Bytes20;
use crate::instruction::Instruction::Set;
use crate::state::Data;

pub struct Processor {}

impl Processor {
    pub fn process(
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let data_account = next_account_info(accounts_iter)?;

        let mut data = data_account.try_borrow_mut_data()?;

        let mut store = Data::new(&data).unwrap();

        let instruction = Instruction::unpack(&instruction_data);

        match instruction {
            Instruction::Get(key) => {
                Self::process_get(&store, key);
            },
            Instruction::Set(key, value) => {
                Self::process_set(&mut store, key, value);
            },
            Instruction::Write(start_key, size) => {
                Self::process_write(&mut store, start_key, size);
            },
            Instruction::Scan(start_key, size) => {
                Self::process_scan(&mut store, start_key, size);
            }
            Instruction::RevertScan(start_key, size) =>{
                Self::process_revert_scan(&mut store, start_key, size);
            }
            _ => {}
        };

        Data::pack(&store, &mut data);
        sol_log(&format!("{:?}", store));
        Ok(())
    }

    fn get_key(k: usize) -> Bytes20 {
        Self::uint_to_bytes(U256::from(k))
    }

    fn get_val(k: usize) -> String {
        let mut ret = [0; 100];
        for i in 0..100 {
            ret[i] = Data::ALPHABET[k % 50 + i];
        }
        String::from_utf8(ret.to_vec()).unwrap()
    }

    pub fn process_revert_scan(store: &mut HashMap<[u8; 20], String>, start_key: usize, size: usize) {
        for i in 0..size {
            Self::process_get(
                store,
                Self::get_key(start_key + size - i - i).value,
            );
        }
    }

    pub fn process_scan(store: &mut HashMap<[u8; 20], String>, start_key: usize, size: usize) {
        for i in 0..size {
            Self::process_get(
                store,
                Self::get_key(start_key + i).value,
            );
        }
    }

    pub fn process_write(store: &mut HashMap<[u8; 20], String>, start_key: usize, size: usize) {
        for i in 0..size {
            Self::process_set(
                store,
                Self::get_key(start_key + i).value,
                Self::get_val(start_key + i),
            )
        }
    }

    fn process_set(store: &mut HashMap<[u8; 20], String>, key: [u8; 20], value: String) {
        store.insert(key, value);
    }

    fn process_get(store: &HashMap<[u8; 20], String>, key: [u8; 20]) -> Option<&String> {
        store.get(&key[..])
    }

    fn uint_to_bytes(v: U256) -> Bytes20 {
        let mut ret = Bytes20::empty();
        let zero_u256= U256::zero();
        let mut uint_ret;
        let mut pow_2_to_8;
        let mut inside_value;
        let mut bytes_ret;
        let mut v_mod_10;
        let mut v_mod_10_plus_48;
        let mut mul_8_19;
        let mut pow_2_to_8_19;
        let mut inside_value_before_bytes20;
        let mut to_bit_or_with_ret;

        if v.is_zero() {
            return Bytes20::zeros_in_string();
        }
        else {
            let mut v_idx = v.clone();
            while v_idx.gt(&zero_u256) {

                uint_ret = ret.to_u256().unwrap();
                pow_2_to_8 = U256::from(2).pow(U256::from(8));
                inside_value = uint_ret.overflowing_div(pow_2_to_8).0;
                bytes_ret = Bytes20::from_u256(&inside_value).unwrap();

                v_mod_10 = v_idx.overflowing_rem(U256::from(10)).0;
                v_mod_10_plus_48 = v_mod_10.overflowing_add(U256::from(48)).0;
                mul_8_19 = U256::from(8).overflowing_mul(U256::from(19)).0;
                pow_2_to_8_19 = U256::from(2).pow(mul_8_19);
                inside_value_before_bytes20 = v_mod_10_plus_48.overflowing_mul(pow_2_to_8_19).0;
                to_bit_or_with_ret = Bytes20::from_u256(&inside_value_before_bytes20).unwrap();

                ret = bytes_ret.bitor(&to_bit_or_with_ret);

                v_idx = v_idx.overflowing_div(U256::from(10)).0;
            }

            ret
        }
    }
}