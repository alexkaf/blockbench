#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

COMMAND=". ~/.cargo/env"
COMMAND="$COMMAND && export PATH=\$PATH:/home/ubuntu/assesments/blockbench/benchmark/solana-install/solana/target/release"
COMMAND="$COMMAND && cd \$ASSESMENTS/blockbench/src/macro/rust-driver && cargo build"

for host in $(cat hosts)
do
    ssh -oStrictHostKeyChecking=no $CURRENT_USER@$host $COMMAND &
done