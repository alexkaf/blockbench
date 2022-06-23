use crate::r#type::{Generator, GeneratorType};

#[derive(Debug)]
pub struct ConstantGenerator {
    pub last_: u64
}

impl ConstantGenerator {
    pub fn new(constant: u64) -> Generator {
        let constant_generator = ConstantGenerator {
            last_: constant,
        };
        Generator {
            generator: GeneratorType::Constant(constant_generator),
        }
    }

    pub fn next(&mut self) -> u64 {
        self.last_
    }

    pub fn last(&mut self) -> u64 {
        self.last_
    }
}