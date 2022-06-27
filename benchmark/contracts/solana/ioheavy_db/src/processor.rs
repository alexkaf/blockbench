use std::collections::HashMap;
use std::fmt::format;
use borsh::{BorshSerialize};
use solana_program::{
    entrypoint_deprecated::ProgramResult,
    account_info::{AccountInfo, next_account_info},
    msg,
    log::{sol_log_slice, sol_log},
    system_instruction::create_account,
    program_error::ProgramError,
};
use solana_program::program::invoke_signed;
use crate::instruction::Instruction;

pub struct Processor {}

impl Processor {
    pub fn process(
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let fee_payer = next_account_info(accounts_iter)?;
        let data_account = next_account_info(accounts_iter)?;
        let system_program = next_account_info(accounts_iter)?;

        let instruction = Instruction::new(instruction_data);
        match instruction {
            Instruction::Get(key) => {
                let seeds = Self::create_seed(&key[..]);
                Self::process_get(fee_payer, data_account, system_program, seeds)
            },
            Instruction::Set(key, value) => {
                sol_log("Set");
                sol_log(&format!("{:?}", key));
                sol_log(&format!("{:?}", value));
            },
            Instruction::Other => {
                sol_log("Other");
            }
        }
        Ok(())
    }

    fn process_get(fee_payer: &AccountInfo, data_account: &AccountInfo, system_program: &AccountInfo, seeds: Vec<&[u8]>){
        let mut data = data_account.try_borrow_mut_data().unwrap();

        if data.is_empty() {

            invoke_signed(&create_account(
                fee_payer.key,
                data_account.key,

            ))

        }
    }

    fn process_set(fee_payer: &AccountInfo, data_account: &AccountInfo, system_program: &AccountInfo){
        let mut data = data_account.try_borrow_mut_data().unwrap();

        if data.is_empty() {
            sol_log(&format!("Empty!"));
        }
    }

    fn create_seed(input: &[u8]) -> Vec<&[u8]> {
        let mut seeds = Vec::<&[u8]>::new();

        if input.len() > 16 {
            seeds.push(&input[..16]);
            seeds.push(&input[16..]);
        } else {
            seeds.push(&input);
        }
        seeds
    }
}