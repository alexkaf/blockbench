#!/bin/bash

apt update && apt upgrade -y
apt install -y curl git build-essential

apt-get update
apt-get install -y libssl-dev libudev-dev pkg-config zlib1g-dev llvm clang cmake make libprotobuf-dev protobuf-compiler

curl https://sh.rustup.rs -sSf | sh -s -- -y
source "$HOME/.cargo/env"
rustup component add rustfmt
rustup update