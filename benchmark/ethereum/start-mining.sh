#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

geth --datadir=$ETH_DATA \
     --http.api="db,eth,net,web3,personal,web3" \
     --http \
     --http.addr 0.0.0.0 \
     --allow-insecure-unlock \
     --ws \
     --ws.addr 0.0.0.0 \
     --networkid 123454321 \
     --unlock 0 \
     --password <(echo -n "") \
     --mine \
     --nat extip:$1 \
     --miner.threads 8 > $ETH_DATA/log 2>&1 &

sleep 20

rm -rf addPeer.txt
./gather.sh $2

for com in $(cat addPeer.txt); do
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$host" "geth attach ~/ethereum/data/geth.ipc --exec $com"
done