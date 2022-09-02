#!/bin/bash

idx=0

function ask_and_scp() {
    host=$1
    idx=$2
    ssh ubuntu@$host "curl http://localhost:6060/debug/metrics" > band_$idx
}

for host in `cat ../../../../benchmark/ethereum/hosts`; do
  if [[ $idx -lt $1 ]]; then
    ask_and_scp $host $idx &
  fi
  let idx=$idx+1
done

wait 

cat band_* > bandwidth
rm band_*