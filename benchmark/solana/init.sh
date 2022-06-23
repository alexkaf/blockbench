#!/bin/bash

solana config set --url localhost
source env.sh

[[ ! -d $ACCOUNTS ]] && mkdir $ACCOUNTS
[[ ! -d $LOGS ]] && mkdir $LOGS

solana-keygen new --no-bip39-passphrase -so $ACCOUNTS/validator.json
solana-keygen new --no-bip39-passphrase -so $ACCOUNTS/vote-account.json
solana-keygen new --no-bip39-passphrase -so $ACCOUNTS/stake-account.json

args=(--bootstrap-validator $ACCOUNTS/validator.json $ACCOUNTS/vote-account.json $ACCOUNTS/stake-account.json
--ledger $LEDGER_PATH
--faucet-lamports 500000000000000000
--enable-warmup-epochs
--slots-per-epoch 100)

if [ $1 -eq 0 ]
then
  solana-keygen new --no-bip39-passphrase -so $ACCOUNTS/faucet.json
  args+=(--faucet-pubkey $ACCOUNTS/faucet.json)

  solana-genesis "${args[@]}"

  ./faucet.sh
fi

