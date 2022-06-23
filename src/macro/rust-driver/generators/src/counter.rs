use crate::r#type::*;

#[derive(Debug)]
pub struct CounterGenerator {
    pub last_: u64
}

impl CounterGenerator {

    pub fn new(counter: u64) -> Generator {
        let counter_generator = CounterGenerator {
            last_: counter
        };
        Generator {
            generator: GeneratorType::Counter(counter_generator)
        }
    }

    pub fn next(&mut self) -> u64 {
        self.last_ += 1;
        self.last_
    }

    pub fn last(&mut self) -> u64 {
        self.last_
    }
}