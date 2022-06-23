pub mod r#type;
pub mod constant;
pub mod counter;
pub mod uniform;
pub mod zipfian;
pub mod scrambled_zipfian;

use std::num::Wrapping;
use rand::Rng;

const K_FNV_OFFSET_BASIS_64: u64 = 0xCBF29CE484222325;
const K_FNV_PRIME_64: u64 = 1099511628211;

fn get_random_double() -> f64{
    let mut rng = rand::thread_rng();

    rng.gen::<f64>()
}

fn fnv_hash_64(mut value: u64) -> u64 {
    let mut hash = Wrapping(K_FNV_OFFSET_BASIS_64);
    for _ in 0..8 {
        let octet = value & 0x00F;
        value >>= 8;
        hash ^= octet;
        hash *= K_FNV_PRIME_64;
    }
    hash.0
}