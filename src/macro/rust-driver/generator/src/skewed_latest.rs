#![allow(unused)]

use std::cell::RefCell;
use std::rc::Rc;
use crate::counter::CounterGenerator;
use crate::zipfian::ZipfianGenerator;
use crate::generator::Generator;
use crate::uniform::UniformGenerator;

#[derive(Debug)]
pub struct SkewedLatestGenerator{
    basis_: Rc<RefCell<CounterGenerator>>,
    zipfian_: ZipfianGenerator,
    last_: u64,
}

impl SkewedLatestGenerator{
    pub fn new(counter: Rc<RefCell<CounterGenerator>>) -> Self {
        let mut last_counter_value = counter.borrow_mut().last();
        Self {
            basis_: counter,
            zipfian_: ZipfianGenerator::new_single(last_counter_value),
            last_: 0
        }
    }

    pub fn next(&mut self) -> u64 {
        let mut max = self.basis_.borrow_mut().last();
        self.last_ = max - self.zipfian_.next_single_arg(max);
        self.last_
    }

    pub fn last(&self) -> u64 {
        self.last_
    }
}

impl Generator for SkewedLatestGenerator {
    type Object = u64;
    fn next(&mut self) -> u64 {
        let mut max = self.basis_.borrow_mut().last();
        self.last_ = max - self.zipfian_.next_single_arg(max);
        self.last_
    }

    fn last(&mut self) -> u64 {
        self.last_
    }
}