#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

for host in $(cat hosts); do
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "cd assesments/blockbench && git stash && git pull --force" &
#  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "cd assesments/blockbench && git pull --force" &
done

wait
echo DONE