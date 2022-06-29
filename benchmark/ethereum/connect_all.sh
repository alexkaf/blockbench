#!/bin/bash

cd `dirname ${BASH_SOURCE-$0}`
. env.sh

./gather.sh $1

function copy_and_connect() {
  scp addPeer.txt "$CURRENT_USER@$1:$ETH_HOME"

  cd "$ETH_HOME"
  for com in $(cat addPeer.txt); do
    ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$1" "geth attach ~/ethereum/data/geth.ipc --exec $com"
  done
}

for host in $(cat hosts); do
  copy_and_connect $host &
done

wait

