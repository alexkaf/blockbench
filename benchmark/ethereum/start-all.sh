#!/bin/bash
#nodes
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

i=0
for host in `cat hosts`; do
  if [[ $i -lt $1 ]]; then
    ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "$ETH_HOME/start-mining.sh $host $1"
    echo done node $host
  fi
  let i=$i+1
done

echo Waiting 40 seconds...
sleep 40

./connect_all.sh $1
#sleep 3