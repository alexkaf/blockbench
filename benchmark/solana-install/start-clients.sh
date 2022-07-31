#!/bin/bash

# Threads Txrate Workload
here=$(dirname "$0")
source $here/env.sh

idx=0
for client in $(cat clients); do
  if [$idx -eq $1] then 
    exit 0
  done

  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$client" "cd /$SERVER_HOME/assesments/blockbench/src/macro/rust-driver && source ~/.cargo/env && cargo run -- -db solana -endpoint http://localhost:8899 -txrate $2 -threads $3 -P /root/assesments/blockbench/src/macro/kvstore/workloads/workload$4.spec " &
done
