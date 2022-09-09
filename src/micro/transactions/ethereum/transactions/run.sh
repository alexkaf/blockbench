#!/bin/bash

cd /home/ubuntu/assesments/blockbench/src/micro/transactions/ethereum/transactions

node driver.js -k $1 -total $2 $3 -txs $4 -r $5 -name $6