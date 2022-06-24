#!/bin/bash

export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

here=$(dirname "$0")
source $here/env.sh

BOOTSTRAP_NODE=$(head -n 1 hosts)
solana config set --url http://$BOOTSTRAP_NODE:8899/ > /dev/null

solana catchup $ACCOUNTS/vote-account-keypair.json