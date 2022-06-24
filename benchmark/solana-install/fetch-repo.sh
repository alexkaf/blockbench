#!/bin/bash

function get_repo() {
  ssh -oStrictHostKeyChecking=no ubuntu@$1 "mkdir assesments"
  ssh -oStrictHostKeyChecking=no ubuntu@$1 "sudo apt-get update && sudo apt-get install -y git"
  ssh -oStrictHostKeyChecking=no ubuntu@$1 "cd assesments && git clone https://github.com/alexkaf/blockbench.git"

  echo "$i Done!"
}

for host in $(cat hosts)
do
  get_repo $host &
done

wait