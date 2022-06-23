use std::ops::Sub;
use std::slice::Iter;
use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::{
    pubkey::{self, Pubkey, MAX_SEED_LEN, MAX_SEEDS},
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    system_instruction::create_account,
    sysvar::{rent::Rent, Sysvar},
    program::invoke_signed,
};

use crate::instruction::Instruction;
use crate::state::Data;
use bigint::U256;
// use core::slice::Iter;

pub struct Processor {}


impl Processor {
    pub fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = Instruction::unpack(&instruction_data);
        let mut accounts_iter = &mut accounts.into_iter();
        let fee_payer = next_account_info(accounts_iter)?;
        let system_program = next_account_info(accounts_iter)?;

        match instruction {
            Instruction::Almagate(arg0, arg1) => {
                let pda_saving = next_account_info(accounts_iter)?;
                let pda_checking = next_account_info(accounts_iter)?;
                let seeds = Self::create_smallbank_seed(arg0.as_bytes(), b"saving");

                if pda_saving.owner == system_program.key {
                    let (_pda, bump) = Pubkey::find_program_address(&seeds[..], program_id);

                    invoke_signed(&create_account(
                        fee_payer.key,
                        &pda_saving.key,
                        Rent::get()?.minimum_balance(32),
                        32,
                        program_id,
                    ),
                                  &[fee_payer.clone(), pda_saving.clone(), system_program.clone()],
                                  &[&[&seeds[..], &[&[bump]]].concat()[..]])?;
                }

                if pda_checking.owner == system_program.key {
                    let seeds = Self::create_smallbank_seed(arg1.as_bytes(), b"checking");
                    let (_pda, bump) = Pubkey::find_program_address(&seeds[..], program_id);

                    invoke_signed(&create_account(
                        fee_payer.key,
                        &pda_checking.key,
                        Rent::get()?.minimum_balance(32),
                        32,
                        program_id,
                    ),
                                  &[fee_payer.clone(), pda_checking.clone(), system_program.clone()],
                                  &[&[&seeds[..], &[&[bump]]].concat()[..]])?;
                }
                Self::process_almagate(pda_saving, pda_checking,);
            },
            Instruction::GetBalance(arg0) => {
                let pda_saving = next_account_info(accounts_iter)?;
                let pda_checking = next_account_info(accounts_iter)?;

                if pda_saving.owner == system_program.key {
                    let seeds = Self::create_smallbank_seed(arg0.as_bytes(), b"saving");
                    let (_pda, bump) = Pubkey::find_program_address(&seeds[..], program_id);

                    invoke_signed(&create_account(
                        fee_payer.key,
                        &pda_saving.key,
                        Rent::get()?.minimum_balance(32),
                        32,
                        program_id,
                    ),
                                  &[fee_payer.clone(), pda_saving.clone(), system_program.clone()],
                                  &[&[&seeds[..], &[&[bump]]].concat()[..]])?;
                }

                if pda_checking.owner == system_program.key {
                    let seeds = Self::create_smallbank_seed(arg0.as_bytes(), b"checking");
                    let (_pda, bump) = Pubkey::find_program_address(&seeds[..], program_id);

                    invoke_signed(&create_account(
                        fee_payer.key,
                        &pda_checking.key,
                        Rent::get()?.minimum_balance(32),
                        32,
                        program_id,
                    ),
                                  &[fee_payer.clone(), pda_checking.clone(), system_program.clone()],
                                  &[&[&seeds[..], &[&[bump]]].concat()[..]])?;
                }
                Self::process_get_balance(pda_saving, pda_checking,);
            }
            Instruction::UpdateBalance(arg0, arg1) => {
                let pda_checking = next_account_info(accounts_iter)?;
                if pda_checking.owner == system_program.key {
                    let seeds = Self::create_smallbank_seed(arg0.as_bytes(), b"checking");
                    let (_pda, bump) = Pubkey::find_program_address(&seeds[..], program_id);

                    invoke_signed(&create_account(
                        fee_payer.key,
                        &pda_checking.key,
                        Rent::get()?.minimum_balance(32),
                        32,
                        program_id,
                    ),
                                  &[fee_payer.clone(), pda_checking.clone(), system_program.clone()],
                                  &[&[&seeds[..], &[&[bump]]].concat()[..]])?;
                }
                Self::process_update_balance(pda_checking, arg1);
            }
            Instruction::UpdateSaving(arg0, arg1) => {
                let pda_saving = next_account_info(accounts_iter)?;

                if pda_saving.owner == system_program.key {
                    let seeds = Self::create_smallbank_seed(arg0.as_bytes(), b"saving");
                    let (_pda, bump) = Pubkey::find_program_address(&seeds[..], program_id);

                    invoke_signed(&create_account(
                        fee_payer.key,
                        &pda_saving.key,
                        Rent::get()?.minimum_balance(32),
                        32,
                        program_id,
                    ),
                                  &[fee_payer.clone(), pda_saving.clone(), system_program.clone()],
                                  &[&[&seeds[..], &[&[bump]]].concat()[..]])?;
                }

                Self::process_update_saving(pda_saving, arg1);
            }
            Instruction::SendPayment(arg0, arg1, arg2) => {
                let pda_checking_0 = next_account_info(accounts_iter)?;
                let pda_checking_1 = next_account_info(accounts_iter)?;

                if pda_checking_0.owner == system_program.key {
                    let seeds = Self::create_smallbank_seed(arg0.as_bytes(), b"checking");
                    let (_pda, bump) = Pubkey::find_program_address(&seeds[..], program_id);

                    invoke_signed(&create_account(
                        fee_payer.key,
                        &pda_checking_0.key,
                        Rent::get()?.minimum_balance(32),
                        32,
                        program_id,
                    ),
                                  &[fee_payer.clone(), pda_checking_0.clone(), system_program.clone()],
                                  &[&[&seeds[..], &[&[bump]]].concat()[..]])?;
                }

                if pda_checking_1.owner == system_program.key {
                    let seeds = Self::create_smallbank_seed(arg1.as_bytes(), b"checking");
                    let (_pda, bump) = Pubkey::find_program_address(&seeds[..], program_id);

                    invoke_signed(&create_account(
                        fee_payer.key,
                        &pda_checking_1.key,
                        Rent::get()?.minimum_balance(32),
                        32,
                        program_id,
                    ),
                                  &[fee_payer.clone(), pda_checking_1.clone(), system_program.clone()],
                                  &[&[&seeds[..], &[&[bump]]].concat()[..]])?;
                }
                Self::process_send_payment(pda_checking_0, pda_checking_1, arg2);
            },
            Instruction::WriteCheck(arg0, arg1) => {
                let pda_saving = next_account_info(accounts_iter)?;
                let pda_checking = next_account_info(accounts_iter)?;
                if pda_saving.owner == system_program.key {
                    let seeds = Self::create_smallbank_seed(arg0.as_bytes(), b"saving");
                    let (_pda, bump) = Pubkey::find_program_address(&seeds[..], program_id);

                    invoke_signed(&create_account(
                        fee_payer.key,
                        &pda_saving.key,
                        Rent::get()?.minimum_balance(32),
                        32,
                        program_id,
                    ),
                                  &[fee_payer.clone(), pda_saving.clone(), system_program.clone()],
                                  &[&[&seeds[..], &[&[bump]]].concat()[..]])?;
                }
                if pda_checking.owner == system_program.key {
                    let seeds = Self::create_smallbank_seed(arg0.as_bytes(), b"checking");
                    let (_pda, bump) = Pubkey::find_program_address(&seeds, program_id);

                    invoke_signed(&create_account(
                        fee_payer.key,
                        &pda_checking.key,
                        Rent::get()?.minimum_balance(32),
                        32,
                        program_id,
                    ),
                                  &[fee_payer.clone(), pda_checking.clone(), system_program.clone()],
                                  &[&[&seeds[..], &[&[bump]]].concat()[..]])?;
                }

                Self::process_write_check(pda_saving, pda_checking, arg1);
            }
            _ => {}
        }
        Ok(())
    }

    fn process_almagate(saving: &AccountInfo,
                        checking: &AccountInfo,) -> ProgramResult {
        let bal1 = U256::from_little_endian(&saving.try_borrow_data()?);
        let bal2 = U256::from_little_endian(&checking.try_borrow_data()?);

        let mut saving_data = saving.try_borrow_mut_data()?;
        let mut checking_data = checking.try_borrow_mut_data()?;

        U256::from(0).to_little_endian(&mut checking_data);
        bal1.saturating_add(bal2).to_little_endian(&mut saving_data);

        Ok(())
    }

    fn process_get_balance(saving: &AccountInfo,
                           checking: &AccountInfo,) -> ProgramResult {
        let bal1 = U256::from_little_endian(&saving.try_borrow_data()?);
        let bal2 = U256::from_little_endian(&checking.try_borrow_data()?);

        Ok(())
    }

    fn process_update_balance(checking: &AccountInfo,
                              arg1: U256,) -> ProgramResult {

        let mut checking_data = checking.try_borrow_mut_data()?;
        let bal1 = U256::from_little_endian(&checking_data);

        arg1.saturating_add(bal1).to_little_endian(&mut checking_data);

        Ok(())
    }

    fn process_update_saving(saving: &AccountInfo,
                             arg1: U256,) -> ProgramResult {

        let mut saving_data = saving.try_borrow_mut_data()?;
        let bal1 = U256::from_little_endian(&saving_data);

        arg1.saturating_add(bal1).to_little_endian(&mut saving_data);

        Ok(())
    }

    fn process_send_payment(checking_0: &AccountInfo,
                            checking_1: &AccountInfo,
                            arg2: U256,) -> ProgramResult {

        let mut data_0 = checking_0.try_borrow_mut_data()?;
        let mut data_1 = checking_1.try_borrow_mut_data()?;

        let bal1 = U256::from_little_endian(&data_0);
        let bal2 = U256::from_little_endian(&data_1);

        bal1.saturating_sub(arg2).to_little_endian(&mut data_0);
        bal2.saturating_add(arg2).to_little_endian(&mut data_1);

        Ok(())
    }

    fn process_write_check(saving: &AccountInfo,
                           checking: &AccountInfo,
                           arg1: U256) -> ProgramResult {
        let mut data_1 = checking.try_borrow_mut_data()?;
        let mut data_2 = saving.try_borrow_mut_data()?;

        let bal1 = U256::from_little_endian(&data_1);
        let bal2 = U256::from_little_endian(&data_2);

        let total = bal1.saturating_add(bal2);

        if total.gt(&arg1) {
            bal1.saturating_sub(arg1).saturating_sub(U256::from(1)).to_little_endian(&mut data_1);
        }else {
            bal1.saturating_sub(arg1).to_little_endian(&mut data_1);
        }

        Ok(())
    }

    fn create_smallbank_seed<'a>(input: &'a [u8], account_type: &'a [u8]) -> Vec<&'a [u8]> {
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

        chunks.push(account_type);
        chunks
    }

    // fn create_account_if_needed(program_id: &Pubkey, fee_payer: AccountInfo, pda: AccountInfo, system_program: AccountInfo, account: &[u8], account_type: &[u8]) {
    //     if pda.owner == system_program.key {
    //         let seeds = Self::create_smallbank_seed(account, account_type);
    //         let (_pda, bump) = Pubkey::find_program_address(&seeds[..], program_id);
    //
    //         invoke_signed(&create_account(
    //             fee_payer.key,
    //             &pda.key,
    //             Rent::get().unwrap().minimum_balance(32),
    //             32,
    //             program_id,
    //         ),
    //                       &[fee_payer.clone(), pda.clone(), system_program.clone()],
    //                       &[&[&seeds[..], &[&[bump]]].concat()[..]]).unwrap();
    //     }
    // }


}