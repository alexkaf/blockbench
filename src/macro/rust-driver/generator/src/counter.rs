use std::sync::atomic::{
    AtomicU64,
    Ordering,
};
use crate::generator::Generator;

#[derive(Debug)]
pub struct CounterGenerator {
    counter_: AtomicU64
}

impl CounterGenerator {
    pub fn set(&self, start: u64) {
        self.counter_.store(start, Ordering::Relaxed);
    }

    pub fn new (start: u64) -> Self {
        CounterGenerator {
            counter_: AtomicU64::new(start),
        }
    }

    fn next(&mut self) -> u64 {
        self.counter_.fetch_add(1, Ordering::Relaxed)
    }

    fn last(&mut self) -> u64 {
        self.counter_.load(Ordering::Relaxed)
    }
}

impl Generator for CounterGenerator {
    type Object = u64;

    fn next(&mut self) -> u64 {
        self.counter_.fetch_add(1, Ordering::Relaxed)
    }

    fn last(&mut self) -> u64 {
        self.counter_.load(Ordering::Relaxed)
    }
}