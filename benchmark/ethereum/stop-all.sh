#!/bin/bash
#arg nnodes
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

i=0
#for host in $(cat $CLIENTS); do
#    ssh -oStrictHostKeyChecking=no $CURRENT_USER@$host sudo killall -KILL driver
#    echo done node $host
#done

for host in `cat hosts`; do
  if [[ $i -lt $1 ]]; then
    ssh -oStrictHostKeyChecking=no $CURRENT_USER@$host "sudo $ETH_HOME/stop.sh" &
    echo done node $host
  fi
  let i=$i+1
done


