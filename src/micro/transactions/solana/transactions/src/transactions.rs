#![allow(unused)]
use std::{sync::{RwLock, Arc}, collections::HashMap, time::Duration, thread::{self, sleep}, fs::File, io::Write};

use rand::Rng;
use solana_sdk::{signature::{Signature, Keypair, Signer}, transaction::Transaction, client, commitment_config::{CommitmentLevel, CommitmentConfig}};
use solana_program::system_instruction::transfer;
use solana_client::{rpc_client::RpcClient, rpc_config::{RpcSendTransactionConfig, RpcBlockConfig}};
use chrono::{Utc, DateTime};
use solana_transaction_status::{EncodedConfirmedBlock, EncodedTransactionWithStatusMeta, EncodedTransaction, UiTransaction, UiConfirmedBlock};

use crate::environment::Environment;

enum TransactionInfo {
    Start(DateTime<Utc>),
    End(DateTime<Utc>, DateTime<Utc>)
}

pub struct Transactions {}

impl Transactions {

    const CONFIGS: RpcSendTransactionConfig = RpcSendTransactionConfig {
        skip_preflight: true, 
        preflight_commitment: Some(CommitmentLevel::Confirmed),
        encoding: None,
        max_retries: None,
        min_context_slot: None,
    };

    pub fn fire(env: Arc<Environment>) {
        let mut pending = Arc::new(RwLock::new(HashMap::<String, DateTime<Utc>>::new()));
        let total_keypairs = env.count();
        let total_threads = env.threads();
        let txs_per_thread = env.transactions() / env.threads();
        let sleep_time = Duration::from_millis(total_threads * 1000 / env.rate());

        let clients = env.clients();


        let transactions = Arc::new(Self::create_transactions(&clients[0], &env.keypairs(), env.transactions()));
        let mut handles = vec![];

        for thread_idx in 0..total_threads {
            let mut pending = Arc::clone(&pending);

            let transactions_list = Arc::clone(&transactions);
            let start = (thread_idx * txs_per_thread) as usize;
            let end = (start + txs_per_thread as usize) as usize;

            let env = Arc::clone(&env);

            let handle = thread::spawn(move || {
                let mut client_cycle = env.clients().iter().cycle();
                for tx_idx in start..end {
                    let current_transaction = &transactions_list[tx_idx];
                    let hash = client_cycle.next().unwrap().send_transaction_with_config(current_transaction, Self::CONFIGS).unwrap();
                    pending.write().unwrap().insert(hash.to_string(), Utc::now());
                    sleep(sleep_time);
                }
            });
            handles.push(handle);
        }

        let mut monitors = vec![];

        let mut results = File::create("/root/results.txt").unwrap();
        let mut pending = Arc::clone(&pending);
        let env = Arc::clone(&env);

        results.write_all(format!("Start, {}\n", Utc::now().timestamp_nanos()).as_bytes());
        let monitor = thread::spawn(move || {
            let client = &env.clients()[0];

            let mut current_slot = client.get_block_height().unwrap();
            let mut total_found = 0;
            loop {
                let next_slot = client.get_block_height_with_commitment(CommitmentConfig::confirmed()).unwrap();

                if next_slot == current_slot {
                    sleep(Duration::from_millis(100));
                    continue
                } else {
                    current_slot = next_slot;
                }

                let contents = client.get_block_with_config(current_slot, RpcBlockConfig {
                    encoding: None,
                    transaction_details: None,
                    rewards: None,
                    commitment: Some(CommitmentConfig::confirmed()),
                    max_supported_transaction_version: None,
                }).unwrap();

                let block_signatures = Self::collect_signatures_from_block(contents);

                for signature in block_signatures {
                    if pending.read().unwrap().contains_key(&signature) {
                        total_found += 1;
                        if total_found % 1000 == 0 {
                            println!("{}/{}", total_found, total_threads * txs_per_thread);
                        }
                        results.write_all(format!("{}, , {:?}\n", current_slot, (Utc::now().timestamp_nanos() - pending.read().unwrap().get(&signature).unwrap().timestamp_nanos())).as_bytes());
                    }
                }
                if pending.read().unwrap().len() == (total_threads * txs_per_thread) as usize {
                    println!("Done!");
                    results.write_all(format!("End, {}\n", Utc::now().timestamp_nanos()).as_bytes());
                    return ;
                }
            }
        });
        monitors.push(monitor);

        for handle in handles {
            handle.join().unwrap();
        }

        for monitor in monitors {
            monitor.join().unwrap();
        }


    }

    fn collect_signatures_from_block(block: UiConfirmedBlock) -> Vec<String> {
        let block_transactions = block.transactions.unwrap();
        let mut signatures = vec![];

        for tx in block_transactions {
            if let EncodedTransaction::Json(contents) = tx.transaction {
                signatures.push(contents.signatures[0].clone());
            }
        }
        signatures
    }

    fn create_transactions(client: &RpcClient, keypairs: &Vec<Keypair>, tx_count: u64) -> Vec<Transaction>{
        println!("Generating {} transactions...", tx_count);
        let keypair_count = keypairs.len();
        let mut transactions = vec![];
        let recent_blockhash = client.get_latest_blockhash().unwrap();
        for idx in 0..tx_count {

            #[allow(irrefutable_let_patterns)]
            if let (from_idx, to_idx) = Self::get_random_pair(keypair_count) {
                let from_keypair = &keypairs[from_idx];
                let to_keypair = &keypairs[to_idx];

                let instruction = transfer(&from_keypair.pubkey(), &to_keypair.pubkey(), Self::get_random_lamports());

                let tx = Transaction::new_signed_with_payer(
                    &[instruction],
                    Some(&from_keypair.pubkey()),
                    &[from_keypair],
                    recent_blockhash,
                );
                transactions.push(tx);
            }
        }
        transactions
    }

    fn get_random_pair(keypair_count: usize) -> (usize, usize) {
        let mut rng = rand::thread_rng();

        let from = rng.gen_range(0..keypair_count);
        
        let mut to: usize;
        loop {
            to = rng.gen_range(0..keypair_count);
            if from != to {
                break
            }
        };

        (from, to)
    }

    fn get_random_lamports() -> u64 {
        let mut rng = rand::thread_rng();

        rng.gen_range(1..10000)
    }

} 