#!/bin/bash
#nodes
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

i=0
for host in `cat hosts`; do
  if [[ $i -lt $1 ]]; then
    ssh -oStrictHostKeyChecking=no $CURRENT_USER@$host $ETH_HOME/start-mining.sh $host
    echo done node $host
  fi
  let i=$i+1
done

#rm -rf addPeer.txt
#
#./gather.sh $1
#
#for host in $(cat hosts); do
#  for com in $(cat addPeer.txt); do
#    ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "geth attach ~/ethereum/data/geth.ipc --exec $com"
#  done
#done
#
#sleep 3