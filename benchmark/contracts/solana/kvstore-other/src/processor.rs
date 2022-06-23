use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::{
    pubkey::{self, Pubkey},
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
    const VALUE_LEN: usize = 50;
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

        if pda.owner == system_program.key {
            sol_log(" ");
        } else {
            let data = pda.try_borrow_data()?;
            let object = Data::unpack(&data);
            sol_log(&format!("{}", object.value()));
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

        let (_pda, bump) = Pubkey::find_program_address(&[
            set_struct.key.as_bytes().as_ref(),
        ], program_id);

        if pda.owner == system_program.key{
            invoke_signed(&create_account(
                fee_payer.key,
                pda.key,
                Rent::get()?.minimum_balance(Self::VALUE_LEN),
                Self::VALUE_LEN as u64,
                program_id),
   &[fee_payer.clone(), pda.clone(), system_program.clone()],
   &[&[set_struct.key.as_bytes().as_ref(), &[bump]]]
            );
        }
        let mut data = pda.try_borrow_mut_data()?;

        Data::store(&set_struct.value, &mut data);

        Ok(())
    }
}