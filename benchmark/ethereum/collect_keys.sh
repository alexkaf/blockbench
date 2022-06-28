#!/bin/bash

cd `dirname ${BASH_SOURCE-$0}`
. env.sh

for host in $(cat hosts); do
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "ssh-keygen"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "cat ~/.ssh/id_rsa.pub" >> keys
done

for host in $(cat hosts); do
  KEYS=$(cat keys)
  scp -oStrictHostKeyChecking=no keys "$CURRENT_USER@$host:~/.ssh/temp"
done
