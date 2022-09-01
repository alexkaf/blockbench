#!/bin/bash

../solana-install/execute_to_all.sh $1 "geth attach --exec eth.syncing ~/ethereum/data/geth.ipc"