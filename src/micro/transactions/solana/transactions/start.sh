#!/bin/bash

HOSTS=/home/alexandros/Documents/gitter/blockbench/benchmark/solana-install/hosts

HOSTS_USED=$(head -n 8 $HOSTS)

KEYS=$1
TXS=$2
THREADS=$3
RATE_FOR_FILE=$4
RATE=$4
CLIENTS=$5

TXS=$(expr $TXS / $CLIENTS)
RATE=$(expr $RATE / $CLIENTS)

RUST_CMD="transactions -k $KEYS -txs $TXS -t $THREADS -r $RATE"

for host in $HOSTS_USED; do 
    RUST_CMD="$RUST_CMD -e $host"
done

echo $RUST_CMD

for host in `tail -n $CLIENTS $HOSTS`; do
    ssh -oStrictHostKeyChecking=no "ubuntu@$host" "/home/ubuntu/assesments/blockbench/src/micro/transactions/solana/transactions/target/debug/$RUST_CMD" &
done

wait

idx=0
for host in `tail -n $CLIENTS $HOSTS`; do 
    scp -oStrictHostKeyChecking=no "ubuntu@$host:~/test.txt" t_$idx &
    let idx=$idx+1
done

wait 

FILE=sat_$RATE_FOR_FILE
cat t_* > /home/alexandros/Desktop/new_results/$FILE
rm t_*

echo /home/alexandros/Desktop/new_results/$FILE