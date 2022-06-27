#!/bin/bash
ip_addr=$1

#ENODE=$(geth --datadir=$ETH_DATA --http.addr 0.0.0.0 --http --allow-insecure-unlock --ws --ws.addr 0.0.0.0 --networkid 123454321 --unlock 0 --password <(echo -n "") js <(echo 'console.log(admin.nodeInfo.enode);') 2>/dev/null |grep enode | perl -pe "s/\[\:\:\]/$ip_addr/g" | perl -pe "s/^/\"/; s/\s*$/\"/;";)
#REPLACED=${ENODE/127.0.0.1/${ip_addr}}

ENODE=$(geth attach ~/ethereum/data/geth.ipc --exec admin.nodeInfo.enode)
echo "$ENODE"
#echo $REPLACED


#geth --exec admin.nodeInfo.enode attach ipc:/$ETH_DATA/geth.ipccat

#geth attach --datadir $ETH_DATA --exec admin.nodeInfo.enode