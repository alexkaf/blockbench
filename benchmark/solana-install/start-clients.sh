#!/bin/bash

# Threads Txrate Workload
here=$(dirname "$0")
source $here/env.sh

idx=0
for client in $(cat clients); do
  if [ $idx -eq "$2" ] 
  then 
    exit 0
  fi

  if [ $1 -eq "smallbank" ]
  then 
    ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$client" "cd $SERVER_HOME/assesments/blockbench/src/macro/rust-driver && source ~/.cargo/env && cargo run -- -db solana -endpoint http://localhost:8899 -txrate $4 -threads $3 -wl smallbank -ops $5" &
  fi
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$client" "cd $SERVER_HOME/assesments/blockbench/src/macro/rust-driver && source ~/.cargo/env && cargo run -- -db solana -endpoint http://localhost:8899 -txrate $4 -threads $3 -P $SERVER_HOME/assesments/blockbench/src/macro/kvstore/workloads/workload$5.spec " &

  let idx=$idx+1
done
