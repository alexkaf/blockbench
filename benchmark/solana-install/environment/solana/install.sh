#!/bin/bash

HERE=$(dirname "$0")
source "$HERE/../../env.sh"
source "$HOME/.cargo/env"

# shellcheck disable=SC2164
cd "$BLOCKBENCH"

git clone https://github.com/solana-labs/solana.git

# shellcheck disable=SC2164
cd solana

git checkout v1.10.24
git apply "$BLOCKBENCH/compute_budget.patch"
cargo build --release