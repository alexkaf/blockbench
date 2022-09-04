#!/bin/bash

# Threads Txrate Workload
here=$(dirname "$0")
source $here/env.sh

function start_monitor() {
  ssh -oStrictHostKeyChecking=no $CURRENT_USER@$1 "sudo killall iftop"
  ssh -oStrictHostKeyChecking=no $CURRENT_USER@$1 "rm ~/io"
  ssh -oStrictHostKeyChecking=no $CURRENT_USER@$1 "nohup sudo iftop -t > io &" &
}

idx=0

for client in $(cat clients); do
  start_monitor $client &
done

for client in $(cat clients); do
  if [ $idx -eq "$2" ] 
  then 
    exit 0
  else
    if [[ "$1" == "smallbank" ]]
    then 
        ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$client" "cd $SERVER_HOME/assesments/blockbench/src/macro/rust-driver && source ~/.cargo/env && cargo run -- -db solana -endpoint http://localhost:8899 -txrate $4 -threads $3 -wl smallbank -ops $5" &
    else
      ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$client" "cd $SERVER_HOME/assesments/blockbench/src/macro/rust-driver && source ~/.cargo/env && cargo run -- -db solana -endpoint http://localhost:8899 -txrate $4 -threads $3 -P $SERVER_HOME/assesments/blockbench/src/macro/kvstore/workloads/workload$5.spec > $BLOCKBENCH/validator/logs/run" &
    fi
  fi
  let idx=$idx+1
done

