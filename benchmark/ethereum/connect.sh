#!/bin/bash

cd `dirname ${BASH_SOURCE-$0}`
. env.sh

cd "$ETH_HOME"

for com in $(cat addPeer.txt); do
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "geth attach ~/ethereum/data/geth.ipc --exec $com"
done