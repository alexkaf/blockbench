#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

function start_client() {
    sleep 15
    echo $1 WAITING FOR LEADER TO GENERATE FIRST SNAPSHOT
    sleep 45
    ssh -oStrictHostKeyChecking=no root@$host $BLOCKBENCH/validator.sh $host $idx &
}

idx=0
for host in $(cat hosts)
do
  if [ $idx -eq 0 ]
  then
    ssh -oStrictHostKeyChecking=no root@$host $BLOCKBENCH/validator.sh $host $idx &
  else
    start_client $host $idx &
  fi
  let idx=$idx+1
done