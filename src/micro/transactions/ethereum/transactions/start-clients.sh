#!/bin/bash

NUMBER_OF_HOSTS=$1
KEYPAIRS=$2
TXS_COUNT=$3
RATE=$4

ETH_CONFIG_DIRECTORY='../../../../../benchmark/ethereum'
source $ETH_CONFIG_DIRECTORY/env.sh

KEYPAIRS_PER_NODE=$(expr $KEYPAIRS / $NUMBER_OF_HOSTS)
TXS_PER_NODE=$(expr $TXS_COUNT / $NUMBER_OF_HOSTS)

echo Keypairs per node: $KEYPAIRS_PER_NODE
echo Transactions per node: $TXS_PER_NODE

for host in `head -n $NUMBER_OF_HOSTS $ETH_CONFIG_DIRECTORY/hosts`; do
    ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "/home/ubuntu/assesments/blockbench/src/micro/transactions/ethereum/transactions/run.sh $KEYPAIRS_PER_NODE $TXS_PER_NODE $RATE > ~/results.txt" &
done

echo Done

