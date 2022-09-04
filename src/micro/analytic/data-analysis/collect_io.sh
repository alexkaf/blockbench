#!/bin/bash

#!/bin/bash

idx=0

function ask_and_scp() {
    host=$1
    idx=$2
    ssh ubuntu@$host "tail -n 100 ~/io" > band_$idx
}

for host in `cat ../../../../benchmark/solana-install/hosts`; do
  if [[ $idx -lt $1 ]]; then
    ask_and_scp $host $idx &
  fi
  let idx=$idx+1
done

wait