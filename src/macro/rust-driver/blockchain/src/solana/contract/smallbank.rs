use solana_client::rpc_config::RpcSendTransactionConfig;
use crate::solana::driver::Solana;
use solana_program::instruction::{AccountMeta, Instruction};
use solana_program::system_program;
use solana_sdk::{
    transaction::Transaction,
    pubkey::Pubkey,
    signature::Signer,
};
use solana_sdk::commitment_config::CommitmentLevel;
use borsh::BorshSerialize;
use bigint::U256;
use solana_sdk::signature::Signature;
use crate::create_smallbank_seed;

#[derive(BorshSerialize)]
struct AlmaGateInstruction {
    id: u8,
    arg0: String,
    arg1: String,
}

impl AlmaGateInstruction {
    fn new(arg0: &str, arg1: &str) -> Self {
        AlmaGateInstruction {
            id: 0,
            arg0: arg0.to_string(),
            arg1: arg1.to_string(),
        }
    }
}

#[derive(BorshSerialize)]
struct GetBalanceInstruction {
    id: u8,
    arg0: String,
}

impl GetBalanceInstruction {
    fn new(arg0: &str,) -> Self {
        GetBalanceInstruction {
            id: 1,
            arg0: arg0.to_string(),
        }
    }
}

#[derive(BorshSerialize)]
struct UpdateBalanceInstruction {
    id: u8,
    arg0: String,
    arg1: [u8; 32],
}

impl UpdateBalanceInstruction {
    fn new(arg0: &str, arg1: u64) -> Self {
        let mut amount_array = [0u8; 32];
        U256::from(arg1).to_little_endian(&mut amount_array);
        UpdateBalanceInstruction {
            id: 2,
            arg0: arg0.to_string(),
            arg1: amount_array,
        }
    }
}

#[derive(BorshSerialize)]
struct UpdateSavingInstruction {
    id: u8,
    arg0: String,
    arg1: [u8; 32],
}

impl UpdateSavingInstruction {
    fn new(arg0: &str, arg1: u64) -> Self {
        let mut amount_array = [0u8; 32];
        U256::from(arg1).to_little_endian(&mut amount_array);
        UpdateSavingInstruction {
            id: 3,
            arg0: arg0.to_string(),
            arg1: amount_array,
        }
    }
}

#[derive(BorshSerialize)]
struct SendPayment {
    id: u8,
    arg0: String,
    arg1: String,
    arg2: [u8; 32],
}

impl SendPayment {
    fn new(arg0: &str, arg1: &str, arg2: u64) -> Self {
        let mut amount_array = [0u8; 32];
        U256::from(arg2).to_little_endian(&mut amount_array);
        SendPayment {
            id: 4,
            arg0: arg0.to_string(),
            arg1: arg1.to_string(),
            arg2: amount_array,
        }
    }
}

#[derive(BorshSerialize)]
struct WriteCheckInstruction {
    id: u8,
    arg0: String,
    arg1: [u8; 32],
}

impl WriteCheckInstruction {
    fn new(arg0: &str, arg1: u64) -> Self {
        let mut amount_array = [0u8; 32];
        U256::from(arg1).to_little_endian(&mut amount_array);
        WriteCheckInstruction {
            id: 5,
            arg0: arg0.to_string(),
            arg1: amount_array,
        }
    }
}

pub struct SmallBank {}

impl SmallBank {
    const RPC_SEND_CONFIG: RpcSendTransactionConfig = RpcSendTransactionConfig {
        skip_preflight: true,
        preflight_commitment: Some(CommitmentLevel::Confirmed),
        encoding: None,
        max_retries: None,
        min_context_slot: None
    };

    pub fn almagate(driver: &Solana, from: &str, to: &str) -> Signature {
        let (pda_saving, _) = Self::create_pda(&driver.program, from.as_bytes(), b"saving");
        let (pda_checking, _) = Self::create_pda(&driver.program, to.as_bytes(), b"checking");

        let almagate_instruction = Instruction::new_with_borsh(
            driver.program,
            &AlmaGateInstruction::new(from, to),
            vec![
                AccountMeta::new_readonly(driver.fee_payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::ID, false),
                AccountMeta::new(pda_saving, false),
                AccountMeta::new(pda_checking, false),
            ]
        );

        let almagate_transaction = Transaction::new_signed_with_payer(
          &[almagate_instruction],
            Some(&driver.fee_payer.pubkey()),
            &[&driver.fee_payer],
            driver.connection.get_latest_blockhash().unwrap(),
        );

        driver.connection.send_transaction_with_config(&almagate_transaction, Self::RPC_SEND_CONFIG).unwrap()
    }

    pub fn get_balance(driver: &Solana, account: &str) -> Signature {
        let (pda_saving, _) = Self::create_pda(&driver.program, account.as_bytes(), b"saving");
        let (pda_checking, _) = Self::create_pda(&driver.program, account.as_bytes(), b"checking");

        let get_balance_instruction = Instruction::new_with_borsh(
            driver.program,
            &GetBalanceInstruction::new(account),
            vec![
                AccountMeta::new_readonly(driver.fee_payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::ID, false),
                AccountMeta::new(pda_saving, false),
                AccountMeta::new(pda_checking, false),
            ]
        );

        let get_balance_transaction = Transaction::new_signed_with_payer(
            &[get_balance_instruction],
            Some(&driver.fee_payer.pubkey()),
            &[&driver.fee_payer],
            driver.connection.get_latest_blockhash().unwrap(),
        );

        driver.connection.send_transaction_with_config(&get_balance_transaction, Self::RPC_SEND_CONFIG).unwrap()
    }

    pub fn update_balance(driver: &Solana, account: &str, amount: u64) -> Signature {
        let (pda_checking, _) = Self::create_pda(&driver.program, account.as_bytes(), b"checking");

        let update_balance_instruction = Instruction::new_with_borsh(
            driver.program,
            &UpdateBalanceInstruction::new(account, amount),
            vec![
                AccountMeta::new_readonly(driver.fee_payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::ID, false),
                AccountMeta::new(pda_checking, false),
            ]
        );

        let update_balance_transaction = Transaction::new_signed_with_payer(
            &[update_balance_instruction],
            Some(&driver.fee_payer.pubkey()),
            &[&driver.fee_payer],
            driver.connection.get_latest_blockhash().unwrap(),
        );

        driver.connection.send_transaction_with_config(&update_balance_transaction, Self::RPC_SEND_CONFIG).unwrap()
    }

    pub fn update_saving(driver: &Solana, account: &str, amount: u64) -> Signature {
        let (pda_checking, _) = Self::create_pda(&driver.program, account.as_bytes(), b"saving");

        let update_saving_instruction = Instruction::new_with_borsh(
            driver.program,
            &UpdateSavingInstruction::new(account, amount),
            vec![
                AccountMeta::new_readonly(driver.fee_payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::ID, false),
                AccountMeta::new(pda_checking, false),
            ]
        );

        let update_saving_transaction = Transaction::new_signed_with_payer(
            &[update_saving_instruction],
            Some(&driver.fee_payer.pubkey()),
            &[&driver.fee_payer],
            driver.connection.get_latest_blockhash().unwrap(),
        );

        driver.connection.send_transaction_with_config(&update_saving_transaction, Self::RPC_SEND_CONFIG).unwrap()
    }

    pub fn send_payment(driver: &Solana, from: &str, to: &str, amount: u64) -> Signature {
        let (pda_checking_0, _) = Self::create_pda(&driver.program, from.as_bytes(), b"checking");
        let (pda_checking_1, _) = Self::create_pda(&driver.program, to.as_bytes(), b"checking");

        let send_payment_instruction = Instruction::new_with_borsh(
            driver.program,
            &SendPayment::new(from, to, amount),
            vec![
                AccountMeta::new_readonly(driver.fee_payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::ID, false),
                AccountMeta::new(pda_checking_0, false),
                AccountMeta::new(pda_checking_1, false),
            ]
        );

        let send_payment_transaction = Transaction::new_signed_with_payer(
            &[send_payment_instruction],
            Some(&driver.fee_payer.pubkey()),
            &[&driver.fee_payer],
            driver.connection.get_latest_blockhash().unwrap(),
        );

        driver.connection.send_transaction_with_config(&send_payment_transaction, Self::RPC_SEND_CONFIG).unwrap()
    }

    pub fn write_check(driver: &Solana, from: &str, amount: u64) -> Signature {
        let (pda_checking, _) = Self::create_pda(&driver.program, from.as_bytes(), b"checking");
        let (pda_saving, _) = Self::create_pda(&driver.program, from.as_bytes(), b"saving");

        let write_check_instruction = Instruction::new_with_borsh(
            driver.program,
            &WriteCheckInstruction::new(from, amount),
            vec![
                AccountMeta::new_readonly(driver.fee_payer.pubkey(), true),
                AccountMeta::new_readonly(system_program::ID, false),
                AccountMeta::new(pda_saving, false),
                AccountMeta::new(pda_checking, false),
            ]
        );

        let write_check_transaction = Transaction::new_signed_with_payer(
            &[write_check_instruction],
            Some(&driver.fee_payer.pubkey()),
            &[&driver.fee_payer],
            driver.connection.get_latest_blockhash().unwrap(),
        );

        driver.connection.send_transaction_with_config(&write_check_transaction, Self::RPC_SEND_CONFIG).unwrap()
    }

    fn create_pda(program_id: &Pubkey, from: &[u8], account_type: &[u8]) -> (Pubkey, u8) {
        let seeds = create_smallbank_seed(from, account_type);
        Pubkey::find_program_address(
            &seeds[..],
            program_id,
        )
    }
}

