#!/bin/bash

HERE=$(dirname "$0")
ASSESMENTS=/home/ubuntu/assesments
BLOCKBENCH_REPO=$ASSESMENTS/blockbench

sudo apt-get update
sudo apt-get install -y git

function fetch_repo() {
  ssh -oStrictHostKeyChecking=no ubuntu@"$1" "mkdir -p $ASSESMENTS"
  ssh -oStrictHostKeyChecking=no ubuntu@"$1" "cd $ASSESMENTS && git clone https://github.com/alexkaf/blockbench.git"
  ssh -oStrictHostKeyChecking=no ubuntu@"$1" "cd $BLOCKBENCH_REPO && git checkout micro-develop"
  ssh -oStrictHostKeyChecking=no ubuntu@"$1" "chmod +x -R $BLOCKBENCH_REPO"
}

# shellcheck disable=SC2013
for host in $(cat "$HERE"/../hosts)
do
  fetch_repo "$host" &
done

wait

