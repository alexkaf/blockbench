#!/bin/bash

# Install dependencies
apt update && apt install -y git vim
apt-get update
apt-get install -y libssl-dev libudev-dev pkg-config zlib1g-dev llvm clang cmake make libprotobuf-dev protobuf-compiler jq psmisc


# Installs rust
curl https://sh.rustup.rs -sSf | sh -s -- -y
source $HOME/.cargo/env
rustup component add rustfmt
rustup update

# Installs solana tools from source
[[ ! -d solana ]] && git clone https://github.com/solana-labs/solana.git

cd solana

git checkout v1.10.24
cargo build --release

# Add solana tools in path
export PATH=$PATH:$(pwd)/target/release

#sh -c "$(curl -sSfL https://release.solana.com/v1.10.24/install)"
#export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"