use rand::Rng;
use solana_client::rpc_config::RpcSendTransactionConfig;
use solana_sdk::signature::Signature;
use crate::solana::driver::Solana;
use solana_program::instruction::Instruction;
use solana_sdk::{
    transaction::Transaction,
    pubkey::Pubkey,
    signature::Signer,
};
use solana_sdk::commitment_config::CommitmentLevel;

pub struct DoNothing {}


impl DoNothing {
    const RPC_SEND_CONFIG: RpcSendTransactionConfig = RpcSendTransactionConfig {
        skip_preflight: true,
        preflight_commitment: Some(CommitmentLevel::Confirmed),
        encoding: None,
        max_retries: None,
        min_context_slot: None
    };

    pub fn read(driver: &Solana) -> Signature {
        let random_data = Self::get_random_u8_triple();
        // let random_data: [u8; 0] = [];
        let instruction = Instruction::new_with_borsh(driver.program, &random_data, vec![]);

        let recent_blockhash = driver.connection.get_latest_blockhash().unwrap();

        let read_tx = Transaction::new_signed_with_payer(
            &[instruction],
            Some(&driver.fee_payer.pubkey()),
            &[&driver.fee_payer],
            recent_blockhash,
        );
        driver.connection.send_transaction_with_config(&read_tx, Self::RPC_SEND_CONFIG).unwrap()
    }

    fn get_random_u8_triple() -> [u8; 3] {
        let mut rng = rand::thread_rng();
        [rng.gen::<u8>(), rng.gen::<u8>(), rng.gen::<u8>()]
    }
}

