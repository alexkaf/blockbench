#!/bin/bash

HERE=$(dirname "$0")
source "$HERE/../../env.sh"
source "$HOME"/.cargo/env

CONTRACTS="$ASSESMENTS"/blockbench/benchmark/contracts/solana

PROGRAMS=( "kvstore" "donothing" "smallbank" "ioheavy" "cpuheavy" )

for program in ${PROGRAMS[@]}; do
  cd "$CONTRACTS"/"$program"
  cargo build-bpf
done