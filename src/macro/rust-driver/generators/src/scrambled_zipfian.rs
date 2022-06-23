use crate::r#type::*;
use crate::zipfian::ZipfianGenerator;
use crate::fnv_hash_64;

#[derive(Debug)]
pub struct ScrambledZipfianGenerator {
    base_: u64,
    num_items_: u64,
    generator_: ZipfianGenerator,
    last_: u64,
}

impl ScrambledZipfianGenerator {

    pub fn new(min: u64, max: u64, zipfian_const: f64) -> Generator {
        let scrambled_zipfian_generator =
            Self::new_multiple(min, max, zipfian_const);

        Generator {
            generator: GeneratorType::ScrambledZipfian(scrambled_zipfian_generator)
        }
    }

    pub fn next(&mut self) -> u64 {
        let value = self.generator_.next().unwrap();
        self.last_ = self.base_ + fnv_hash_64(value) % self.num_items_;
        self.last_
    }

    pub fn last(&mut self) -> u64 {
        self.last_int_
    }
}

impl ScrambledZipfianGenerator {
    pub fn new_single(num_items: u64) -> Self {
        Self::new_multiple(0, num_items - 1, ZipfianGenerator::K_ZIPFIAN_CONST)
    }

    pub fn new_multiple(min: u64, max: u64, zipfian_const: f64) -> Self {
        Self {
            base_: min,
            num_items_: max - min + 1,
            generator_: ZipfianGenerator::new(min, max, zipfian_const),
            last_: 0,
        }
    }
}