use solana_program::{
    entrypoint,
    entrypoint::ProgramResult,
    account_info::AccountInfo,
    pubkey::Pubkey,
};

use crate::processor::Processor;

entrypoint!(process);

fn process(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    Processor::process_instruction(program_id, accounts, instruction_data)
}

