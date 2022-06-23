use crate::generator::Generator;

#[derive(Debug)]
pub struct ConstGenerator {
    constant_: u64,
}

impl ConstGenerator {

    pub fn new (constant: u64) -> Self {
        ConstGenerator {
            constant_: constant,
        }
    }
    fn next(&mut self) -> u64 {
        self.constant_
    }

    fn last(&mut self) -> u64 {
        self.constant_
    }
}

impl Generator for ConstGenerator {
    type Object = u64;

    fn next(&mut self) -> Self::Object {
        self.constant_
    }

    fn last(&mut self) -> Self::Object {
        self.constant_
    }
}