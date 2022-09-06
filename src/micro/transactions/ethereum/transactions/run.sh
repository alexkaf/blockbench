#!/bin/bash

cd /home/ubuntu/assesments/blockbench/src/micro/transactions/ethereum/transactions

node driver.js -k $1 -e localhost -txs $2 -r $3