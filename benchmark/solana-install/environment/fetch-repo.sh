#!/bin/bash

HERE=$(dirname "$0")
source "$HERE"/../env.sh
BLOCKBENCH_REPO=$ASSESMENTS/blockbench

function fetch_repo() {
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "sudo apt-get update && sudo apt-get install -y git"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "mkdir -p $ASSESMENTS"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "git config --global user.name alexkaf"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "git config --global user.email alexkafiris@gmail.com"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "ssh-keyscan github.com >> ~/.ssh/known_hosts"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "cd $ASSESMENTS && git clone git@github.com:alexkaf/blockbench.git"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "cd $BLOCKBENCH_REPO && git checkout micro-develop"
}

# shellcheck disable=SC2013
for host in $(cat "$HERE"/../hosts)
do
  fetch_repo "$host" &
done

wait

