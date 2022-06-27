#!/bin/bash
#args: number_of_nodes
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

geth --datadir=$ETH_DATA init /home/ubuntu/ethereum/genesis.json
geth --datadir=$ETH_DATA --password <(echo -n "") account new
