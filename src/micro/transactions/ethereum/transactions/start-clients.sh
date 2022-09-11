#!/bin/bash

CLIENTS=$1
TXS=$2
RATE=$3
THREADS_PER_CLIENT=$4
RESULTS_FILE=$5

TXS_PER_CLIENT=$(expr $TXS / $CLIENTS)
RATE_PER_CLIENT=$(expr $RATE / $CLIENTS)

ETH_CONFIG_DIRECTORY='../../../../../benchmark/ethereum'

HOSTS=$(head -n $CLIENTS $ETH_CONFIG_DIRECTORY/hosts);

rm test_*

for host in $HOSTS; do
    ssh -oStrictHostKeyChecking=no "ubuntu@$host" "rm ~/test*" &
done

wait

for host in $HOSTS; do 
    ssh -oStrictHostKeyChecking=no "ubuntu@$host" "/home/ubuntu/assesments/blockbench/src/micro/transactions/ethereum/transactions/sender/driver -txcount $TXS_PER_CLIENT -threads $THREADS_PER_CLIENT -txrate $RATE_PER_CLIENT -endpoint localhost > ~/results.txt" &
done

echo All started...

wait 

idx=0
for host in $HOSTS; do 
    scp -oStrictHostKeyChecking=no "ubuntu@$host:~/test.txt" test_$idx 
    let idx=$idx+1
done

cat test_* > $RESULTS_FILE
rm test_*

echo Done
