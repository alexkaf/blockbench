#!/bin/bash

HERE=$(dirname "$0")
source "$HERE/../env.sh"
source "$HOME/.cargo/env"

for host in $(cat ../hosts); do
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "$BLOCKBENCH/environment/solana/compile_programs.sh" &
done

wait