#!/bin/bash

cd `dirname ${BASH_SOURCE-$0}`
. env.sh

i=0
for host in `cat hosts`; do
  if [[ $i -lt $1 ]]; then
    ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "geth attach --exec eth.pendingTransactions ~/ethereum/data/geth.ipc" &
  fi
  let i=$i+1
done

wait
echo DONE