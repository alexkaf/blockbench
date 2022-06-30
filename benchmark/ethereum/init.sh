#!/bin/bash
#args: number_of_nodes
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

mkdir ~/ethereum
rm ~/ethereum/genesis.json
cp $ETH_HOME/CustomGenesis_$1.json ~/ethereum/genesis.json

geth --datadir=$ETH_DATA init /home/ubuntu/ethereum/genesis.json
geth --datadir=$ETH_DATA --password <(echo -n "") account new
