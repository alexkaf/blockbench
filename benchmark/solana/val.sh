#!/bin/bash

solana-validator \
  --accounts-db-skip-shrink \
  --enable-cpi-and-log-storage \
  --no-poh-speed-test \
  --skip-poh-verify \
  --tpu-use-quic \
  --skip-seed-phrase-validation \
  --identity /root/validator/accounts/validator.json \
  --gossip-host 135.181.4.42 \
  --gossip-port 8001 \
  --rpc-port 8899 \
  --no-os-network-limits-test \
  --no-wait-for-vote-to-start-leader \
  --log /root/validator/logs/validator \
  --rpc-faucet-address 127.0.0.1:9900 \
  --enable-rpc-transaction-history \
  --ledger /root/validator/ledger \
  --vote-account /root/validator/accounts/vote-account.json &