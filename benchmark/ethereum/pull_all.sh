#!/bin/bash

here=$(dirname "$0")
source $here/env.sh

for host in $(cat hosts); do
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "cd assesments/blockbench && git pull" &
done

wait
echo DONE