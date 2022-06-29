#![allow(unused)]
use std::env;
use std::str::FromStr;
use std::thread::sleep;
use std::time::Duration;
use rand::Rng;
use solana_client::rpc_client::RpcClient;
use solana_client::rpc_config::RpcTransactionConfig;
use solana_sdk::signature::{Keypair, Signature, Signer};
use solana_program::system_instruction::transfer;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_sdk::transaction::Transaction;
use solana_transaction_status::UiTransactionEncoding;

fn make_keypairs(vec_to_fill: &mut Vec<Keypair>) -> &Vec<Keypair> {
    for _ in 0..5_000 {
        vec_to_fill.push(Keypair::new());
    }
    vec_to_fill
}

fn airdrop_accounts(rpc_endpoint: &RpcClient, keypairs: &Vec<Keypair>) {
    for pair in keypairs.into_iter() {
        rpc_endpoint.request_airdrop(&pair.pubkey(), 5_000_000_000).unwrap();
    }
}

fn execute_random_transactions(tx_count: u64,
                               client: &RpcClient,
                               keypairs: &Vec<Keypair>) -> (Signature, Signature){
    let keypair_cnt = keypairs.len();
    let mut rng = rand::thread_rng();
    let mut from;
    let mut to;
    let mut amount;
    let mut recent_blockhash;
    let mut transfer_ix;
    let mut tx;
    let mut idx = 0;
    let mut first_hash = Signature::new_unique();
    let mut last_hash= Signature::new_unique();

    for _ in 0..tx_count {
        from = &keypairs[rng.gen_range(0..keypair_cnt)];
        to = &keypairs[rng.gen_range(0..keypair_cnt)];
        amount = rng.gen_range(1..5_000);
        recent_blockhash = client.get_latest_blockhash().unwrap();

        transfer_ix = transfer(&from.pubkey(), &to.pubkey(), amount);
        tx = Transaction::new_signed_with_payer(&[transfer_ix],
                                                Some(&from.pubkey()),
                                                &[from],
                                                recent_blockhash);
        let hash = client.send_transaction(&tx);

        if idx == 0 {
            first_hash = hash.unwrap();
        } else if idx == tx_count - 1 {
            last_hash = hash.unwrap();
        }

        if idx % 1_000 == 0 {
            println!("{}", idx);
        }

        idx += 1;
    }
    (first_hash.clone(), last_hash.clone())
}

fn main() {
    let mut args = env::args().into_iter();
    args.next().unwrap();
    let endpoint = args.next().unwrap();
    let tx_count = u64::from_str(&args.next().unwrap()).unwrap();
    let client = RpcClient::new(&endpoint);
    client.get_health();

    let mut to_fill = vec![];
    let keypairs = make_keypairs(&mut to_fill);

    let config = RpcTransactionConfig {
        encoding: Some(UiTransactionEncoding::Json),
        commitment: Some(CommitmentConfig::confirmed()),
        max_supported_transaction_version: None
    };

    println!("Airdropping accounts...");
    airdrop_accounts(&client, &keypairs);

    println!("Accounts airdropped.");
    println!("Waiting 20 seconds...");
    sleep(Duration::from_secs(20));

    println!("Started making transactions...");
    if let (first_hash, last_hash) = execute_random_transactions(tx_count, &client, &keypairs) {

        sleep(Duration::from_secs(2));
        let first_block_slot = client.get_transaction_with_config(&first_hash, config);
        println!("First: {:?}", first_block_slot.unwrap().slot);

        let last_block_slot = client.get_transaction_with_config(&last_hash, config);
        println!("Last: {:?}", last_block_slot.unwrap().slot);
    }
}