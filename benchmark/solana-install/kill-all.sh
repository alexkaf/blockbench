#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

for host in $(cat hosts)
do
  ssh -oStrictHostKeyChecking=no $CURRENT_USER@$host sudo rm -r $SOLANA/config/bootstrap-validator $SOLANA/config/faucet.json $VALIDATOR
  ssh -oStrictHostKeyChecking=no $CURRENT_USER@$host killall solana-faucet solana-validator sleep solana-sys-tuner ssh
done



