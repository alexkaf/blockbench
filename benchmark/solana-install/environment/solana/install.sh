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
git apply "$BLOCKBENCH/ips.patch"
cargo build --release

sh -c "$(curl -sSfL https://release.solana.com/v1.10.24/install)"
mv "$HOME"/.local/share/solana/install/active_release/bin/sdk . "$HOME"/assesments-new/blockbench/benchmark/solana-install/solana/target/release

export PATH="$PATH":"$HOME"/assesments-new/blockbench/benchmark/solana-install/solana/target/release