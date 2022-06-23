pub mod solana;
pub mod ethereum;
pub mod blockchain;

use solana_program::pubkey::{MAX_SEED_LEN, MAX_SEEDS};

pub fn create_kvstore_seed(input: &[u8]) -> Vec<&[u8]> {
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
    chunks
}

pub fn create_smallbank_seed<'a>(input: &'a [u8], account_type: &'a [u8]) -> Vec<&'a [u8]> {
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