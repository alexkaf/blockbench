use crate::generator::Generator;
use crate::get_random_double;

#[derive(Debug)]
pub struct ValueDoublePair<T> {
    value_1: T,
    value_2: f64,
}

#[derive(Debug, Clone, Copy)]
pub enum Operation {
    Insert,
    Read,
    Update,
    Scan,
    ReadModifyWrite,
}

#[derive(Debug)]
pub struct DiscreteGenerator <T>{
    values_: Vec<ValueDoublePair<T>>,
    sum_: f64,
    last_: T,
}

impl DiscreteGenerator<Operation> {
    pub fn new() -> Self {
        DiscreteGenerator {
            values_: Vec::<ValueDoublePair<Operation>>::new(),
            sum_: 0f64,
            last_: Operation::Insert,
        }
    }

    pub fn add_value(&mut self, operation: Operation, weight: f64,) {
        if self.values_.is_empty() {
            self.last_ = operation
        }

        self.values_.push(ValueDoublePair {
            value_1: operation,
            value_2: weight,
        });

        self.sum_ += weight;
    }

    pub fn next(&mut self, ) -> Operation {
        let mut chooser = get_random_double();

        for value in self.values_.iter() {
            if chooser < value.value_2 / self.sum_ {
                self.last_ = value.value_1;
                break;
            }
            chooser -= value.value_2 / self.sum_;
        }

        self.last_
    }

    pub fn last(&mut self) -> Operation {
        self.last_
    }
}

impl Generator for DiscreteGenerator<Operation> {
    type Object = Operation;

    fn next(&mut self, ) -> Operation {
        let mut chooser = get_random_double();

        for value in self.values_.iter() {
            if chooser < value.value_2 / self.sum_ {
                self.last_ = value.value_1;
                break;
            }
            chooser -= value.value_2 / self.sum_;
        }

        self.last_
    }

    fn last(&mut self) -> Operation {
        self.last_
    }

}