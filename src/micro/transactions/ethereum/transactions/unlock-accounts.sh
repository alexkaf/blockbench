#!/bin/bash

ACCOUNTS=$(expr $1 - 1)
HOSTS_NUMBER=$2

HOSTS_FILE=../../../../../benchmark/ethereum/hosts

function unlockAccounts() {
    ACCOUNTS=$1
    ssh -oStrictHostKeyChecking=no "ubuntu@$host" "cd /home/ubuntu/assesments/blockbench/src/micro/transactions/ethereum/transactions; node unlockAccounts.js $ACCOUNTS"
}

for host in `head -n $HOSTS_NUMBER $HOSTS_FILE`; do
    echo $host
    unlockAccounts $ACCOUNTS &
done

wait

echo Done