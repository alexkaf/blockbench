#!/bin/bash

HERE=$(dirname "$0")
source "$HERE/../env.sh"

INSTALLS=$BLOCKBENCH/environment

function install() {

  ssh -oStrictHostKeyChecking=no "$CURRENT_USER"@"$1" "cd $INSTALLS && ./install.sh"
}

# shellcheck disable=SC2013
for host in $(cat "$HERE"/../hosts)
do
  install "$host" &
done

wait