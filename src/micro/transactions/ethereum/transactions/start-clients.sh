#!/bin/bash

NUMBER_OF_HOSTS=$1
KEYPAIRS=$2
TXS_COUNT=$3
THREADS=$4
RATE=$5
RESULTS_NAME=$6

ETH_CONFIG_DIRECTORY='../../../../../benchmark/ethereum'
source $ETH_CONFIG_DIRECTORY/env.sh

KEYPAIRS_PER_NODE=$(expr $KEYPAIRS / $NUMBER_OF_HOSTS)
KEYPAIRS_PER_THREAD=$(expr $KEYPAIRS_PER_NODE / $THREADS)
TXS_PER_NODE=$(expr $TXS_COUNT / $NUMBER_OF_HOSTS)
TXS_PER_THREAD=$(expr $TXS_PER_NODE / $THREADS)
RATE_PER_NODE=$(expr $RATE / $NUMBER_OF_HOSTS)
RATE_PER_THREAD=$(expr $RATE_PER_NODE / $THREADS)

echo Keypairs per node: $KEYPAIRS_PER_NODE
echo Keypairs per thread: $KEYPAIRS_PER_THREAD

echo Transactions per node: $TXS_PER_NODE
echo Transactions per thread: $TXS_PER_THREAD

echo Rate per node: $RATE_PER_NODE
echo Rate per thread: $RATE_PER_THREAD

idx=0
for host in `head -n $NUMBER_OF_HOSTS $ETH_CONFIG_DIRECTORY/hosts`; do
    ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "rm ~/test.txt || touch ~/test.txt" & 
    for ((IDX=0; IDX<$THREADS; IDX++)); do 
        echo $idx $IDX
        ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "/home/ubuntu/assesments/blockbench/src/micro/transactions/ethereum/transactions/run.sh 2 $TXS_PER_THREAD $RATE_PER_THREAD $idx $IDX > ~/results_$IDX.txt"  &
    done
    let idx=$idx+1
done

wait

./collect.sh $NUMBER_OF_HOSTS $RESULTS_NAME
echo Done

