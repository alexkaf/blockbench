#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

function start_client() {
    sleep 60
    ssh -oStrictHostKeyChecking=no root@$host $BLOCKBENCH/validator.sh $host $idx &
}

idx=0
for host in $(cat hosts)
do
  if [ $idx -eq 0 ]
  then
    ssh -oStrictHostKeyChecking=no root@$host $BLOCKBENCH/validator.sh $host $idx
    echo WAITING FOR LEADER TO GENERATE FIRST SNAPSHOT
  else
    start_client $host $idx &
  fi
  let idx=$idx+1
done