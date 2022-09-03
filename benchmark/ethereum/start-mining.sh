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
     --syncmode full \
     --nat extip:$1 \
     --metrics \
     --rpc.allow-unprotected-txs \
     --rpc.txfeecap 0 \
     --metrics.port 6061 \
     --metrics.expensive \
     --nodiscover \
     --pprof \
     --txpool.globalslots 11000 \
     --txpool.accountqueue 10000 \
     --txpool.pricelimit 0 \
     --txpool.accountslots 500 \
     --txpool.globalslots 10000 \
     --miner.threads 6 > $ETH_DATA/log 2>&1 &