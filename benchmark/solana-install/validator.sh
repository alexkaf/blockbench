#!/bin/bash

source $HOME/.cargo/env
#
here=$(dirname "$0")
source $here/env.sh

export PATH="$PATH:$SOLANA/target/release"


cd $BLOCKBENCH

BOOTSTRAP_NODE=$(head -n 1 hosts)

[[ ! -d $VALIDATOR ]] && mkdir -p $LOGS

$(command -v solana-sys-tuner) --user $(whoami) > $LOGS/sys-tuner.log 2>&1 &

if [ $2 -eq 0 ]
then

  cd $SOLANA

  # Create genesis
  echo CREATING BOOTSTRAP NODE GENESIS
  ./multinode-demo/setup.sh  --bootstrap-validator-stake-lamports 5000000000 --slots-per-epoch 200

  # Start faucet
  echo STARTING FAUCET
  nohup ./multinode-demo/faucet.sh > $LOGS/faucet.logs 2>&1 &

  # Start validator
  echo STARTING BOOTSTRAP NODE
  nohup ./multinode-demo/bootstrap-validator.sh \
                        --enable-rpc-transaction-history \
                        --enable-cpi-and-log-storage \
                        --gossip-host $1 \
                        --allow-private-address \
                        --log $LOGS/validator.log &
else
  [ ! -d $ACCOUNTS ] && mkdir -p $ACCOUNTS

  args=()
  ENTRYPOINT_HOST=( $(./get-pubkey.sh) )
  type=0

  echo "${ENTRYPOINT_HOST[@]}"
  for element in "${ENTRYPOINT_HOST[@]}"
  do
    if [ $type -eq 0 ]
    then
      type=1
      args+=(--entrypoint $element:8001)
    else
      type=0
      args+=(--known-validator $element)
    fi
  done

  cd $ACCOUNTS
  solana-keygen new --no-bip39-passphrase --silent --outfile validator-keypair.json
  solana config set --keypair validator-keypair.json
  solana airdrop 10

  solana-keygen new --no-bip39-passphrase --silent --outfile vote-account-keypair.json
  solana-keygen new --no-bip39-passphrase --silent --outfile validator-stake-keypair.json
  solana-keygen new --no-bip39-passphrase --silent --outfile authorized-withdrawer-keypair.json

  solana create-vote-account vote-account-keypair.json validator-keypair.json authorized-withdrawer-keypair.json

  solana create-stake-account validator-stake-keypair.json 5

  args+=(
    --identity $ACCOUNTS/validator-keypair.json
    --no-poh-speed-test
    --full-rpc-api
    --log $LOGS/validator.log
    --no-os-network-limits-test
    --rpc-port 8899
    --gossip-port 8001
    --enable-rpc-transaction-history
    --enable-cpi-and-log-storage
    --vote-account $ACCOUNTS/vote-account-keypair.json
    --rpc-faucet-address $BOOTSTRAP_NODE:9900
    --allow-private-addr
  )
  solana-validator "${args[@]}" &

  solana catchup validator-keypair.json

  solana delegate-stake validator-stake-keypair.json vote-account-keypair.json

fi