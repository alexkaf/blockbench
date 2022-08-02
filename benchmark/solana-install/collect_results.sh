#!/bin/bash

idx=0

for client in $(cat clients); do
  if [ $idx -eq "$1" ]
  then
    break
  fi

  scp "ubuntu@$client:~/test.txt" "temp_$idx" &
  let idx=$idx+1
done

wait

cat temp_* > "results"
rm temp_*

echo Done