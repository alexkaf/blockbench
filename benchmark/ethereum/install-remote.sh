#!/bin/bash

. env.sh

for host in $(cat hosts); do
  ssh -oStrictHostKeyChecking=no $CURRENT_USER@$host $ETH_HOME/install-dependencies.sh $1
done