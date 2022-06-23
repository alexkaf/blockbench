#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

PREV_DIRECTORY=$(pwd)


cd $BLOCKBENCH

[[ ! -d solana ]] && git clone https://github.com/solana-labs/solana.git

cd solana
source $HOME/.cargo/env

TAG=$(git describe --tags $(git rev-list --tags --max-count=1))
git checkout $TAG

cargo build --release

cd $PREV_DIRECTORY