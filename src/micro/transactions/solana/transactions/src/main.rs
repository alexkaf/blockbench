mod transactions;
mod environment;

use std::sync::Arc;
use environment::Environment;
use crate::transactions::Transactions;

fn main() {
    let env = Arc::new(Environment::new());
    Transactions::fire(env);
}
