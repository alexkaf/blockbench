#!/bin/bash
ip_addr=$1

ENODE=$(geth attach ~/ethereum/data/geth.ipc --exec admin.nodeInfo.enode)
echo "$ENODE"
