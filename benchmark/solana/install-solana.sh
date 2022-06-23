#!/bin/bash

source "$HOME/.cargo/env"

git clone https://github.com/solana-labs/solana.git
cd solana || exit;

TAG=$(git describe --tags $(git rev-list --tags --max-count=1))
git checkout "$TAG"

source ci/rust-version.sh

cargo build --release

sh -c "$(curl -sSfL https://release.solana.com/v1.10.19/install)"
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"