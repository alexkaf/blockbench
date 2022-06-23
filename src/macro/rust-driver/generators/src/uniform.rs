use rand::distributions::{Distribution, Uniform};
use crate::r#type::*;

#[derive(Debug)]
pub struct UniformGenerator {
    last_int_: u64,
    dist_: Uniform<u64>,
}

impl UniformGenerator {

    pub fn new(min: u64, max: u64) -> Generator {
        let uniform_generator = UniformGenerator {
            last_int_: min,
            dist_: Uniform::<u64>::from(min..max)
        };
        Generator {
            generator: GeneratorType::Uniform(uniform_generator)
        }
    }

    pub fn next(&mut self) -> u64 {
        let mut range = rand::thread_rng();
        self.last_int_ = self.dist_.sample(&mut range);
        self.last_int_
    }

    pub fn last(&mut self) -> u64 {
        self.last_int_
    }
}