#!/bin/bash
ip_addr=$1

ENODE=$(geth attach --exec admin.nodeInfo.enode ~/ethereum/data/geth.ipc)
echo "$ENODE"
