#!/bin/bash

HERE=$(dirname "$0")
source "$HERE/../env.sh"
source "$HOME/.cargo/env"

for host in $(cat ../hosts); do
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "source ~/.bashrc && echo \$PATH" &
done

wait