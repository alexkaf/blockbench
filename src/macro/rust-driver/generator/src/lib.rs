use std::num::Wrapping;
use rand::Rng;

pub mod constant;
pub mod generator;
pub mod uniform;
pub mod counter;
pub mod polymorph;
pub mod zipfian;
pub mod skewed_latest;
pub mod scrambled_zipfian;
pub mod discrete;

const K_FNV_OFFSET_BASIS_64: u64 = 0xCBF29CE484222325;
const K_FNV_PRIME_64: u64 = 1099511628211;

fn get_random_double() -> f64{
    let mut rng = rand::thread_rng();

    rng.gen::<f64>()
}

fn get_random_u64_with_range() -> u32 {
    let mut rng = rand::thread_rng();

    rng.gen_range(1..1000)
}

pub fn fnv_hash_64(mut value: u64) -> u64 {
    let mut hash = Wrapping(K_FNV_OFFSET_BASIS_64);
    for _ in 0..8 {
        let octet = value & 0x00F;
        value >>= 8;
        hash ^= octet;
        hash *= K_FNV_PRIME_64;
    }
    hash.0
}

pub fn random_print_char() -> char {
    let random_number = get_random_u64_with_range();
    char::from_u32(random_number % 94 + 33).unwrap()
}