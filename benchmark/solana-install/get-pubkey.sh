#!/bin/bash

export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"
BOOTSTRAP_NODE=$(head -n 1 hosts)

solana config set --url http://$BOOTSTRAP_NODE:8899/ > /dev/null

solana gossip --output json | jq -r '.[] | .ipAddress, .identityPubkey'