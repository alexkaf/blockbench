#!/bin/bash

CLIENTS=$1

ETH_CONFIG_DIRECTORY='../../../../../benchmark/ethereum'

HOSTS=$(head -n $CLIENTS $ETH_CONFIG_DIRECTORY/hosts);

for host in $HOSTS; do 
    ssh -oStrictHostKeyChecking=no "ubuntu@$host" "tail -n 1 ~/results.txt"
done