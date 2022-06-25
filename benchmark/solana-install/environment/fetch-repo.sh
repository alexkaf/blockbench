#!/bin/bash

HERE=$(dirname "$0")
source "$HERE"/../env.sh
BLOCKBENCH_REPO=$ASSESMENTS/blockbench

function fetch_repo() {
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "sudo apt-get update && sudo apt-get install -y git"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "mkdir -p $ASSESMENTS"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "cd $ASSESMENTS && git clone https://github.com/alexkaf/blockbench.git"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "cd $BLOCKBENCH_REPO && git checkout micro-develop"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "chmod +x -R $BLOCKBENCH_REPO"
}

# shellcheck disable=SC2013
for host in $(cat "$HERE"/../hosts)
do
  fetch_repo "$host" &
done

wait

