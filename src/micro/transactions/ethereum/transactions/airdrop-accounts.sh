#!/bin/bash

ACCOUNTS=$(expr $1 - 1)
HOSTS_NUMBER=$2

HOSTS=/home/ubuntu/assesments/blockbench/benchmark/ethereum/hosts

function sendFromBasic() {
    ACCOUNTS=$1
    node makeAirdrops.js $ACCOUNTS
}

for host in `head -n $HOSTS_NUMBER $HOSTS`; do
    echo $host
    sendFromBasic $ACCOUNTS &
done

wait

echo Done