#!/bin/bash

cd /home/ubuntu/assesments/blockbench/src/micro/transactions/ethereum/transactions

node driver.js -k $1 -total $2 -e localhost -txs $3 -r $4