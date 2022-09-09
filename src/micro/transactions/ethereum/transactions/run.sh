#!/bin/bash

cd /home/ubuntu/assesments/blockbench/src/micro/transactions/ethereum/transactions

node driver.js -k $1 -total $2 -e 10.0.1.27 -e 10.0.1.28 -txs $3 -r $4 -name $5