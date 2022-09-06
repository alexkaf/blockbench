#!/bin/bash

NUMBER_OF_HOSTS=$1
RESULTS_NAME=$2

ETH_CONFIG_DIRECTORY='../../../../../benchmark/ethereum'
source $ETH_CONFIG_DIRECTORY/env.sh

[ -z $RESULTS_NAME ] && RESULTS_NAME=default

IDX=0
for host in `head -n $NUMBER_OF_HOSTS $ETH_CONFIG_DIRECTORY/hosts`; do
    scp -oStrictHostKeyChecking=no "$CURRENT_USER@$host:~/test.txt" .temp_$IDX &
    let IDX=$IDX+1;
done

wait

cat .temp_* > /home/alexandros/Desktop/new_results/$RESULTS_NAME
rm .temp_*

