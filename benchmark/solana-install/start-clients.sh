#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

for client in $(cat clients); do
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$client" "cd /home/ubuntu/assesments/blockbench/src/macro/rust-driver && source ~/.cargo/env && cargo run -- -db solana -endpoint http://localhost:8899 -txrate 10 -threads 4 -P /home/ubuntu/assesments/blockbench/src/macro/kvstore/workloads/workloada.spec "
done