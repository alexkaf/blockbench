#!/bin/bash

idx=0

for host in $(cat hosts); do
  if [[ $idx -lt $1 ]]; then
    scp "ubuntu@$host:~/test.txt" "temp_$idx" &
  fi
  let idx=$idx+1
done

wait

cat temp_* > "../../src/macro/kvstore/results/eth/donothing/eth_$2_nodes_latencies"

echo Done