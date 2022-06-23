use std::borrow::Borrow;
use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::{
    pubkey::{self, Pubkey, MAX_SEED_LEN, MAX_SEEDS},
    log::sol_log,
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    system_instruction::create_account,
    sysvar::{rent::Rent, Sysvar},
    program::invoke_signed,
};

use crate::instruction::{
    SetIx,
    Instruction,
};
use crate::state::Data;

pub struct Processor {}


impl Processor {
    const VALUE_LEN: usize = 2000;
    pub fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = Instruction::unpack(&instruction_data);

        match instruction {
            Instruction::Log(value) => {
                sol_log(&format!("Log: {}", value));
            },
            Instruction::Set(set_struct) => {
                Self::process_set(program_id, accounts, &set_struct);
            },
            Instruction::Get(key) => {
                Self::process_get(accounts, key);
            }
            Instruction::Other => {}
        };
        Ok(())
    }

    fn process_get(accounts: &[AccountInfo], key: String) -> ProgramResult {

        let mut accounts_iter = &mut accounts.into_iter();
        let _fee_payer = next_account_info(accounts_iter)?;
        let pda = next_account_info(accounts_iter)?;
        let system_program = next_account_info(accounts_iter)?;

        if pda.owner != system_program.key {
            let data = pda.try_borrow_data()?;
            let object = Data::unpack(&data);
            sol_log(&format!("{}", object.value()));
        } else {
            sol_log(&format!("No entry"));
        }

        Ok(())
    }
    fn process_set(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        set_struct: &SetIx) -> ProgramResult {

        let mut accounts_iter = &mut accounts.into_iter();
        let fee_payer = next_account_info(accounts_iter).unwrap();
        let pda = next_account_info(accounts_iter).unwrap();
        let system_program = next_account_info(accounts_iter).unwrap();

        let bytestring = set_struct.key.as_bytes();
        let mut pda_seeds = Self::create_kvstore_seed(bytestring);

        let (_pda, bump) = Pubkey::find_program_address(&pda_seeds[..], program_id);

        if pda.owner == system_program.key {
            invoke_signed(&create_account(
                fee_payer.key,
                pda.key,
                Rent::get()?.minimum_balance(Self::VALUE_LEN),
                Self::VALUE_LEN as u64,
                program_id),
   &[fee_payer.clone(), pda.clone(), system_program.clone()],
   &[&[&pda_seeds[..], &[&[bump]]].concat()[..]]
            );
        }
        let mut data = pda.try_borrow_mut_data()?;

        Data::store(&set_struct.value, &mut data);

        Ok(())
    }

    fn create_kvstore_seed(input: &[u8]) -> Vec<&[u8]> {
        assert!(input.len() <= MAX_SEEDS * MAX_SEED_LEN);

        let number_of_chunks = input.len() / MAX_SEED_LEN;
        let last_chunk_size = input.len() % MAX_SEED_LEN;
        let mut chunks = Vec::<&[u8]>::new();

        for chunk in 0..number_of_chunks {
            let start = chunk * MAX_SEED_LEN;
            let end = (chunk + 1) * MAX_SEED_LEN;
            chunks.push(&input[start..end]);
        }
        if last_chunk_size != 0 {
            let start = number_of_chunks * MAX_SEED_LEN;
            chunks.push(&input[start..])
        }
        chunks
    }

}