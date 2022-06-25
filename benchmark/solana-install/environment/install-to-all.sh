#!/bin/bash

HERE=$(dirname "$0")
INSTALLS=assesments/blockbench/benchmark/solana-install/environment

function install() {

  ssh -oStrictHostKeyChecking=no ubuntu@"$1" "cd $INSTALLS && ./install.sh"
}

# shellcheck disable=SC2013
for host in $(cat "$HERE"/../hosts)
do
  install "$host" &
done

wait