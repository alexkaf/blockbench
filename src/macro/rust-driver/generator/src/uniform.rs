use rand::{
    distributions::Uniform,
    distributions::Distribution,
    self,
};
use crate::generator::Generator;

#[derive(Debug)]
pub struct UniformGenerator {
    last_int_: u64,
    dist_: Uniform<u64>,
}

impl UniformGenerator {

    pub fn new(min: u64, max: u64) -> UniformGenerator {
        Self {
            last_int_: min,
            dist_: Uniform::<u64>::from(min..max),
        }
    }

    pub fn next(&mut self) -> u64 {
        let mut rand_range = rand::thread_rng();
        self.last_int_ = self.dist_.sample(&mut rand_range);
        self.last_int_
    }

    fn last(&mut self) -> u64 {
        self.last_int_
    }
}

impl Generator for UniformGenerator {
    type Object = u64;

    fn next(&mut self) -> u64 {
        let mut rand_range = rand::thread_rng();
        self.last_int_ = self.dist_.sample(&mut rand_range);
        self.last_int_
    }

    fn last(&mut self) -> u64 {
        self.last_int_
    }
}

