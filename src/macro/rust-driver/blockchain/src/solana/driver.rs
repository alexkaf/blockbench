use std::collections::HashMap;
use solana_sdk::{
    signature::{ Keypair, Signer },
    commitment_config::CommitmentConfig,
    pubkey::Pubkey,
};
use solana_client::rpc_client::{
    RpcClient,
};
use std::process::{ Command, ExitStatus, Stdio };
use std::fs::{self, File};
use std::io::Write;
use std::fmt::{Debug, Display, Formatter};
use std::sync::{Arc, Mutex, RwLock};
use chrono::Utc;
use solana_client::rpc_config::{RpcBlockConfig, RpcSendTransactionConfig};
use solana_program::clock::UnixTimestamp;
use solana_sdk::commitment_config::CommitmentLevel;
use solana_sdk::signature::Signature;
use crate::blockchain::{BlockChain, TransactionInfo};
use crate::solana::contract;
use crate::solana::contract::do_nothing::DoNothing;
use crate::solana::contract::kvstore::KVStore;
use crate::solana::contract::smallbank::SmallBank;
use solana_transaction_status::{EncodedTransactionWithStatusMeta, UiConfirmedBlock, UiTransactionEncoding};

use utils::Pair;

pub struct Solana {
    pub fee_payer: Keypair,
    pub connection: RpcClient,
    contract_type: String,
    pub program: Pubkey,
    pub pending_transactions: Arc<Mutex<HashMap<String, TransactionInfo>>>,
    rpc_block_config: RpcBlockConfig,
    // contract: DoNothing,
}

impl Solana {
    
    pub fn new(url: &str, contract_type: &str, pending_transactions: Arc<Mutex<HashMap<String, TransactionInfo>>>) -> Self {
        let connection = RpcClient::new_with_commitment(url, CommitmentConfig::confirmed());
        connection.get_health().unwrap();

        let fee_payer = Keypair::new();
        let program = Keypair::new();

        let hash = connection.request_airdrop(&Signer::pubkey(&fee_payer), 100_000_000_000_000).unwrap();

        while connection
            .confirm_transaction_with_commitment(&hash, CommitmentConfig::finalized())
            .as_ref()
            .unwrap().value {}

        Self::store_keypair(&fee_payer, "feePayer.json");
        Self::store_keypair(&program, "programId.json");

        Self::deploy(contract_type);

        let rpc_block_config = RpcBlockConfig {
            encoding: None,
            transaction_details: None,
            rewards: None,
            commitment: Some(CommitmentConfig::confirmed()),
            max_supported_transaction_version: None
        };
        Self {
            connection,
            fee_payer,
            contract_type: String::from(contract_type),
            program: Signer::pubkey(&program),
            pending_transactions,
            rpc_block_config,
        }
    }

    fn store_keypair(keypair: &Keypair, name: &str) {
        let mut keypair_file = File::create(name).unwrap();
        let file_contents = format!("{:?}", keypair.to_bytes());
        keypair_file.write(&file_contents.as_bytes());
    }

    fn deploy(contract: &str) {
        println!("Contract {:?}", contract);
        let contract_directory = fs::canonicalize(
            format!("/home/ubuntu/assesments/blockbench/benchmark/contracts/solana/{}", contract)).unwrap();
        let program_path =
            contract_directory.as_path().join(format!("target/deploy/{}.so", contract));

        println!("{:?}", contract_directory);
        println!("{:?}", program_path);
        let build = Command::new(&format!("source ~/.cargo/env && cd {:?} && cargo-build-bpf", contract_directory))
            .current_dir(contract_directory)
            .output()
            .unwrap();
            // .stdout(Stdio::null())
            // .status()
            // .expect(&format!("Could not build: {}", contract));

        let deploy = Command::new("solana")
            .args(["program", "deploy", "--keypair", "feePayer.json", "--program-id", "programId.json", program_path.to_str().unwrap()])
            // .stdout(Stdio::null())
            .output()
            // .expect(&format!("Could not deploy: {}", contract));
            .unwrap();

        println!("{:?}", build);
        println!("{:?}", deploy);
    }
}

impl Solana {
    pub fn read(&self, key: &str) -> Result<u8, ()> {
        let hash = match &self.contract_type[..] {
            "donothing" => {
                DoNothing::read(self)
            },
            "kvstore" => {
                KVStore::read(self, key)
            }
            _ => { return Err(()); }
        };
        self.pending_transactions.lock().unwrap().insert(hash.to_string(), TransactionInfo::Started(Utc::now()));

        Ok(1)
    }

    pub fn set(&self, key: &str, fields: &Vec<Pair>) -> Result<u8, ()> {

        let mut value_to_store = String::from("");
        for pair in fields.iter() {
            value_to_store.push_str(&format!("{} = {} ", pair.key, pair.value));
        }
        let hash = match &self.contract_type[..] {
            "donothing" => {
                DoNothing::read(self)
            },
            "kvstore" => {
                KVStore::set(self, key, &value_to_store)
            },
            _ => { return Err(()); }
        };

        self.pending_transactions.lock().unwrap().insert(hash.to_string(), TransactionInfo::Started(Utc::now()));
        Ok(1)
    }

    pub fn almagate(&self, from: &str, to: &str) -> Result<u8, ()> {
        let hash = SmallBank::almagate(&self, from, to);
        self.pending_transactions.lock().unwrap().insert(hash.to_string(), TransactionInfo::Started(Utc::now()));
        Ok(1)
    }

    pub fn get_balance(&self, account: &str) -> Result<u8, ()> {
        let hash = SmallBank::get_balance(&self, account);
        self.pending_transactions.lock().unwrap().insert(hash.to_string(), TransactionInfo::Started(Utc::now()));
        Ok(1)
    }

    pub fn update_balance(&self, account: &str, amount: u64) -> Result<u8, ()> {
        let hash = SmallBank::update_balance(&self, account, amount);
        self.pending_transactions.lock().unwrap().insert(hash.to_string(), TransactionInfo::Started(Utc::now()));
        Ok(1)
    }

    pub fn update_saving(&self, account: &str, amount: u64) -> Result<u8, ()> {
        let hash = SmallBank::update_saving(&self, account, amount);
        self.pending_transactions.lock().unwrap().insert(hash.to_string(), TransactionInfo::Started(Utc::now()));
        Ok(1)
    }

    pub fn send_payment(&self, from: &str, to: &str, amount: u64) -> Result<u8, ()> {
        let hash = SmallBank::send_payment(&self, from, to, amount);
        self.pending_transactions.lock().unwrap().insert(hash.to_string(), TransactionInfo::Started(Utc::now()));
        Ok(1)
    }

    pub fn write_check(&self, from: &str, amount: u64) -> Result<u8, ()> {
        let hash = SmallBank::write_check(&self, from, amount);
        self.pending_transactions.lock().unwrap().insert(hash.to_string(), TransactionInfo::Started(Utc::now()));
        Ok(1)
    }

}

impl BlockChain for Solana {
    type Object = Solana;

    fn get_tip(&self) -> u64 {
        self.connection.get_block_height_with_commitment(CommitmentConfig::confirmed()).unwrap()
    }

    fn poll_transaction_by_block(&self, block_number: u64) -> Option<Vec<EncodedTransactionWithStatusMeta>> {

        let block = self.connection.get_block_with_config(block_number, self.rpc_block_config);
        match block {
            Ok(block) => block.transactions,
            Err(_) => None,
        }
    }
}
