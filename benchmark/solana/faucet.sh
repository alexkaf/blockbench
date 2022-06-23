#!/bin/bash

source env.sh

[[ ! -d $LOGS ]] && mkdir $LOGS

nohup solana-faucet --keypair $ACCOUNTS/faucet.json > $LOGS/faucet 2>&1 &