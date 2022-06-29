#!/bin/bash

cd `dirname ${BASH_SOURCE-$0}`
. env.sh

./gather.sh $2

for host in $(cat hosts); do
  scp addPeer.txt "$CURRENT_USER@$host:$ETH_HOME" &
done

wait