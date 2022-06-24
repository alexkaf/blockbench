#!/bin/bash

for host in $(cat hosts)
do
  ssh ubuntu@$host $@
done