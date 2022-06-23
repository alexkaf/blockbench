#!/bin/bash

# Leader
./multinode-demo/bootstrap-validator.sh --enable-rpc-transaction-history --enable-cpi-and-log-storage


# Validator
solana-validator --entrypoint 135.181.4.42:8001 --identity validator-keypair.json --known-validator AEsWEMnYQ2LnJA4RMafLrrQ6AcNTrjiXcEeWn1d8fcx3 --no-poh-speed-test --full-rpc-api --log - --no-os-network-limits-test --rpc-port 8899 --enable-rpc-transaction-history --enable-cpi-and-log-storage --vote-account vote-account-keypair.json
