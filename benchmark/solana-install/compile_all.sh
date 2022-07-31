#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

for host in $(cat hosts)
do
    ssh -oStrictHostKeyChecking=no $CURRENT_USER@$host ". ~/.cargo/env && && export PATH=\$PATH:/home/ubuntu/assesments/blockbench/benchmark/solana-install/solana/target/release && cd $ASSESMENTS/blockbench/src/macro/rust-driver && cargo build" &
done