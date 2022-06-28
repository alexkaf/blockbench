#!/bin/bash

HERE=$(dirname "$0")
source "$HERE/../../env.sh"
source "$HOME"/.cargo/env

export PATH=/home/ubuntu/.cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/home/ubuntu/assesments/blockbench/benchmark/solana-install/solana/target/release


CONTRACTS="$ASSESMENTS"/blockbench/benchmark/contracts/solana

PROGRAMS=( "kvstore" "donothing" "smallbank" "ioheavy" "cpuheavy" )

for program in ${PROGRAMS[@]}; do
  cd "$CONTRACTS"/"$program"
  cargo build-bpf
done