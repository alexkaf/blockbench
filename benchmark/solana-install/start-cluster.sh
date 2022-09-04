#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

function start_client() {
    ssh -oStrictHostKeyChecking=no $CURRENT_USER@$host $BLOCKBENCH/validator.sh $host $idx &
    ssh -oStrictHostKeyChecking=no $CURRENT_USER@$host "nohup sudo iftop -t > io &" &
}

idx=0
for host in $(cat hosts)
do
  if [ $idx -eq "$1" ]
  then
    exit 0
  fi

  if [ $idx -eq 0 ]
  then
    start_client $host $idx &
    sleep 10
    echo WAITING FOR LEADER TO GENERATE FIRST SNAPSHOT
  else
    start_client $host $idx &
  fi
  let idx=$idx+1
done