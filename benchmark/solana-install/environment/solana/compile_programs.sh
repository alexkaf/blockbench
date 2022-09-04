#!/bin/bash

HERE=$(dirname "$0")
source "$HERE/../../env.sh"
source "$HOME"/.cargo/env

export PATH="/home/ubuntu/.local/share/solana/install/active_release/bin:$PATH"


CONTRACTS="$ASSESMENTS"/blockbench/benchmark/contracts/solana

PROGRAMS=( "kvstore" "donothing" "smallbank" "ioheavy" "cpuheavy" )

for program in ${PROGRAMS[@]}; do
  cd "$CONTRACTS"/"$program"
  cargo build-bpf
done

DRIVER="$ASSESMENTS"/blockbench/src/macro/rust-driver

cd $DRIVER
cargo build