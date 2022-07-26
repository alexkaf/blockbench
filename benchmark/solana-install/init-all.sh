#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

idx=0

function install_serial() {
  ssh -oStrictHostKeyChecking=no $CURRENT_USER@$1 $BLOCKBENCH/install-dependencies.sh

#  if [ $2 -eq 0 ]
#  then
#    ssh -oStrictHostKeyChecking=no root@$1 $BLOCKBENCH/install-solana.sh
#  fi
}

for host in $(cat hosts)
do
  install_serial $host $idx &
  let idx=$idx+1
done

wait
