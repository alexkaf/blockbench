#!/bin/bash

source env.sh

IP=($(ip r))
IP="${IP[2]}"

args=(--gossip-port 8001
  --gossip-host $IP
  --enable-rpc-transaction-history
  --enable-cpi-and-log-storage
  --rpc-port 8899
  --snapshot-interval-slots 200
  --identity $ACCOUNTS/identity.json
  --vote-account $ACCOUNTS/vote-account.json
  --no-os-network-limits-test
  --no-wait-for-vote-to-start-leader
  --full-rpc-api
  --no-poh-speed-test
  --ledger $LEDGER_PATH
  --log $LOGS/validator)

if [ $1 -ne 0 ] 
then
  PUBKEYS=($(./discover-peers.sh))
  args+=(--entrypoint 135.181.4.42:8001
  --known-validator "${PUBKEYS[@]}"
  --no-snapshot-fetch)
else
  args+=(--rpc-faucet-address 127.0.0.1:9900)
  solana-validator --require-tower --ledger /root/solana/config/bootstrap-validator --rpc-port 8899 --snapshot-interval-slots 200 --identity /root/solana/config/bootstrap-validator/identity.json --vote-account /root/solana/config/bootstrap-validator/vote-account.json --rpc-faucet-address 127.0.0.1:9900 --no-poh-speed-test --no-os-network-limits-test --no-wait-for-vote-to-start-leader --gossip-host 135.181.4.42 --full-rpc-api --gossip-port 8001 --log -

fi

solana-validator "${args[@]}" &
