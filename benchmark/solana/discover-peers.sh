#!/bin/bash

BOOTSTRAP_NODE=$(head -n 1 hosts)

solana config set --url http://$BOOTSTRAP_NODE:8899/ > /dev/null

solana gossip --output json | jq -r '.[].identityPubkey'