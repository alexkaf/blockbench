#!/bin/bash

idx=0
for host in $(cat hosts)
do
  if [[ $idx -lt $1 ]]; then
    ssh ubuntu@$host "$2" &
  fi
  let idx=$idx+1
done

wait