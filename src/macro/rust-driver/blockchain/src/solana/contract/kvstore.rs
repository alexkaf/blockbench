use crate::solana::driver::Solana;
use crate::create_kvstore_seed;
use solana_program::instruction::{AccountMeta, Instruction};
use solana_program::system_program;
use solana_client::rpc_config::RpcSendTransactionConfig;
use borsh::BorshSerialize;

use solana_sdk::{
    transaction::Transaction,
    pubkey::Pubkey,
    signature::Signer,
};
use solana_sdk::commitment_config::CommitmentLevel;
use solana_sdk::signature::Signature;

pub struct KVStore {}

#[derive(BorshSerialize)]
struct ReadInstruction {
    id: u8,
    key: String,
}

#[derive(Debug, BorshSerialize)]
struct SetInstruction {
    id: u8,
    key: String,
    value: String,
}

impl ReadInstruction {
    pub fn new(key: &str) -> Self {
        Self {
            id: 2,
            key: key.to_string(),
        }
    }
}

impl SetInstruction {
    pub fn new(key: &str, value: &str) -> Self {
        Self {
            id: 1,
            key: key.to_string(),
            value: value.to_string(),
        }
    }
}

impl KVStore {
    const RPC_SEND_CONFIG: RpcSendTransactionConfig = RpcSendTransactionConfig {
        skip_preflight: true,
        preflight_commitment: Some(CommitmentLevel::Confirmed),
        encoding: None,
        max_retries: None,
        min_context_slot: None
    };

    pub fn read(driver: &Solana, key: &str) -> Signature {
        let (pda, _) = Self::create_pda(&driver.program, key);

        let read_instruction = Instruction::new_with_borsh(
            driver.program,
            &ReadInstruction::new(&key[..]),
            vec![
                AccountMeta::new_readonly(driver.fee_payer.pubkey(), true),
                AccountMeta::new(pda, false),
                AccountMeta::new_readonly(system_program::ID, false),
            ]
        );

        let recent_blockhash = driver.connection.get_latest_blockhash().unwrap();

        let read_transaction = Transaction::new_signed_with_payer(
            &[read_instruction],
            Some(&driver.fee_payer.pubkey()),
            &[&driver.fee_payer],
            recent_blockhash,
        );

        driver.connection.send_transaction_with_config(&read_transaction, Self::RPC_SEND_CONFIG).unwrap()
    }

    pub fn set(driver: &Solana, key: &str, value: &str) -> Signature {
        let (pda, _) = Self::create_pda(&driver.program, key);

        let set_instruction = Instruction::new_with_borsh(
            driver.program,
            &SetInstruction::new(key, value),
            vec![
                AccountMeta::new_readonly(driver.fee_payer.pubkey(), true),
                AccountMeta::new(pda, false),
                AccountMeta::new_readonly(system_program::ID, false),
            ]
        );

        let recent_blockhash = driver.connection.get_latest_blockhash().unwrap();

        let set_transaction = Transaction::new_signed_with_payer(
            &[set_instruction],
            Some(&driver.fee_payer.pubkey()),
            &[&driver.fee_payer],
            recent_blockhash,
        );

        driver.connection.send_transaction_with_config(&set_transaction, Self::RPC_SEND_CONFIG).unwrap()
        // let transaction_hash = driver.connection.send_and_confirm_transaction(&set_transaction).unwrap();

    }

    fn create_pda(program_id: &Pubkey, key: &str) -> (Pubkey, u8) {
        let seeds = create_kvstore_seed(key.as_bytes());
        Pubkey::find_program_address(
            &seeds[..],
            program_id,
        )
    }

}

