#!/bin/bash

cd `dirname ${BASH_SOURCE-$0}`
. env.sh

function make() {
    ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$1" "cd /home/ubuntu/assesments/blockbench/src/macro/kvstore && make clean && make"
    ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$1" "cd /home/ubuntu/assesments/blockbench/src/macro/smallbank && make clean && make"
}

for host in $(cat hosts); do
  if [[ $i -lt $1 ]]; then
      make "$host" &
    fi
    let i=$i+1
done

wait
echo DONE