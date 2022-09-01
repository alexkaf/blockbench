#![allow(unused)]
use std::{env, rc::Rc};
use solana_sdk::{signature::Keypair, signer::Signer, commitment_config::CommitmentConfig};
use solana_client::rpc_client::RpcClient;

type Endpoint = String;

pub struct Environment {
    keypairs_count: usize,
    keypairs: Vec<Keypair>,
    transactions: u64,
    endpoints: Vec<Endpoint>,
    #[allow(dead_code)]
    clients: Option<Vec<RpcClient>>,
    thread_count: u64,
    rate: u64,
}

impl Environment {

    pub fn new() -> Self {
        let mut arguments = env::args();
        let mut keypairs_count: usize = 0;
        let mut transactions: u64 = 0;
        let mut keypairs = vec![];
        let mut endpoints = vec![];
        let mut thread_count:u64 = 0;
        let mut rate:u64 = 0;
        loop {
            let current = arguments.next();

            match current {
                Some(value) => {
                    match &value[..] {
                        "-k" => {
                            keypairs_count = arguments.next().unwrap().parse::<usize>().unwrap();
                            Self::generate_keypairs(keypairs_count, &mut keypairs);
                        }
                        "-txs" => {
                            transactions = arguments.next().unwrap().parse::<u64>().unwrap();
                        }
                        "-e" => {
                            endpoints.push(arguments.next().unwrap());
                        }
                        "-t" => {
                            thread_count = arguments.next().unwrap().parse::<u64>().unwrap();
                        }
                        "-r" => {
                            rate = arguments.next().unwrap().parse::<u64>().unwrap();
                        }
                        _ => {
                            ()
                        }
                    }
                }
                None => {
                    break
                }
            }
        }
        
        let clients = Self::create_clients(&endpoints);
        Self::airdrop_keypairs(&endpoints, &keypairs, &clients);

        Self {
            keypairs_count,
            keypairs,
            transactions,
            endpoints,
            clients: clients,
            thread_count,
            rate,
        }
    }

    fn generate_keypairs(count: usize, keypairs: &mut Vec<Keypair>) {
        println!("Generate {} keypairs...", count);
        for _ in 0..count {
            keypairs.push(Keypair::new());
        }
    }

    pub fn count(&self) -> usize {
        self.keypairs_count
    }

    pub fn keypairs(&self) -> &Vec<Keypair> {
        &self.keypairs
    }

    pub fn transactions(&self) -> u64 {
        self.transactions
    }

    pub fn threads(&self) -> u64 {
        self.thread_count
    }

    pub fn rate(&self) -> u64 {
        self.rate
    }

    pub fn endpoints(&self) -> &Vec<Endpoint> {
        &self.endpoints
    }

    pub fn clients(&self) -> &Vec<RpcClient> {
        self.clients.as_ref().unwrap()
    }

    fn create_clients(endpoints: &Vec<Endpoint>) -> Option<Vec<RpcClient>> {
        println!("Create {} clients...", endpoints.len());
        let mut clients = vec![];
        for endpoint in endpoints {
            clients.push(RpcClient::new(format!("http://{}:8899", endpoint)));
        }

        for client in &clients {
            client.get_health().unwrap();
        }

        Some(clients)
    }

    fn airdrop_keypairs(endpoints: &Vec<Endpoint>, keypairs: &Vec<Keypair>, clients: &Option<Vec<RpcClient>>) {

        println!("Airdrop 1000 SOL to each keypair...");
        let localhost_exists = endpoints.iter().position(|e| e == "localhost");
    
        let client_to_use = match localhost_exists {
            Some(position) => {
                &clients.as_ref().unwrap()[position]
            }
            None => {
                &clients.as_ref().unwrap()[0]
            }
        };
        
        let mut hashes = vec![];
        for keypair in keypairs {
            hashes.push(client_to_use.request_airdrop(&keypair.pubkey(), 1_000_000_000_000).unwrap());
        }

        for hash in hashes {
            while  !client_to_use.confirm_transaction_with_commitment(&hash, CommitmentConfig::confirmed()).unwrap().value {};
        }
    }
}