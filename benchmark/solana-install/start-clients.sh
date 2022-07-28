#!/bin/bash

# Threads Txrate Workload
here=$(dirname "$0")
source $here/env.sh

for client in $(cat clients); do
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$client" "cd /root/assesments/blockbench/src/macro/rust-driver && source ~/.cargo/env && cargo run -- -db solana -endpoint http://localhost:8899 -txrate $1 -threads $2 -P /root/assesments/blockbench/src/macro/kvstore/workloads/workload$3.spec " &
done
