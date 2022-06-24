#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

# Install dependencies
apt update
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
apt install -y git vim npm nodejs g++
npm i -g npm

apt-get update
apt-get install -y libssl-dev libudev-dev pkg-config zlib1g-dev llvm clang cmake make libprotobuf-dev protobuf-compiler jq psmisc


# Installs rust
curl https://sh.rustup.rs -sSf | sh -s -- -y
source $HOME/.cargo/env
rustup component add rustfmt
rustup update

# Installs solana tools from source
cd $BLOCKBENCH

[[ ! -d solana ]] && git clone https://github.com/solana-labs/solana.git

cd solana

git checkout v1.10.24
git apply $BLOCKBENCH/compute_budget.patch
cargo build --release

# Add solana tools in path
echo export PATH="$PATH:$PWD/target/release" >> ~/.bashrc

#sh -c "$(curl -sSfL https://release.solana.com/v1.10.24/install)"
#export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"