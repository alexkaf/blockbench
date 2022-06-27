#!/bin/bash
#nnodes
cd `dirname ${BASH_SOURCE-$0}`
. env.sh 

i=0
for host in `cat hosts`; do
  if [[ $i -lt $1 ]]; then
    echo "admin.addPeer("ssh "$CURRENT_USER@$host" "$ETH_HOME"/enode.sh")" >> addPeer.txt
  fi
  let i=$i+1
  echo $i
done
