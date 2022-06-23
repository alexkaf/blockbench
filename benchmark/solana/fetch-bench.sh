#!/bin/bash

ROOT_USER="root"
function clone_repo() {
  PULL_CHECKOUT="git clone https://github.com/alexkaf/blockbench.git && cd blockbench && git checkout develop"
  ssh -o "StrictHostKeyChecking no" "$ROOT_USER@$1" "$PULL_CHECKOUT"
}

function install_rust() {
  ssh -o "StrictHostKeyChecking no" "$ROOT_USER@$1" ./build-deps.sh
}

function install_solana() {
  ssh -o "StrictHostKeyChecking no" "$ROOT_USER@$1" ./install-solana.sh
}

function move_files() {
  scp -o "StrictHostKeyChecking no" *.sh "$ROOT_USER@$1:~"
}

function job() {
  move_files "$1"
  install_rust "$1"
  install_solana "$1"
  clone_repo "$1"
}

for host in $(cat hosts)
do
  ssh-keygen -f "/root/.ssh/known_hosts" -R "$host"
  job "$host" &
done

wait