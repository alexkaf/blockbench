#!/bin/bash

ACCOUNTS=$(expr $1 - 1)
HOSTS_NUMBER=$2

HOSTS=/home/ubuntu/assesments/blockbench/benchmark/ethereum/hosts


function createAccounts() {
    HOST=$1
    NUMBER_OF_ACCOUNTS=$2
    for idx in `seq 0 $NUMBER_OF_ACCOUNTS`; do 
        
        ssh -oStrictHostKeyChecking=no "ubuntu@$host" "geth --datadir=~/ethereum/data --password <(echo -n \"\") account new"
    done
}

for host in `head -n $HOSTS_NUMBER $HOSTS`; do
    createAccounts $host $ACCOUNTS &
done

wait
echo Done