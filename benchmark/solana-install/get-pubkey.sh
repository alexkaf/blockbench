#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

export PATH="$PATH:/home/ubuntu/.local/share/solana/install/active_release/bin"

BOOTSTRAP_NODE=$(head -n 1 $here/hosts)

solana config set --url http://$BOOTSTRAP_NODE:8899/ > /dev/null

solana gossip --output json | jq -r '.[] | .ipAddress, .identityPubkey'