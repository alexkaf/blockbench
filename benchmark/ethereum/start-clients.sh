#!/bin/bash
# args=THREADS index N txrate
echo IN START_CLIENTS $1 $2 $3 $4

cd `dirname ${BASH_SOURCE-$0}`
. env.sh

#LOG_DIR=$ETH_HOME/../src/ycsb/exp_$3"_"servers_run4
LOG_DIR=$LOG_DIR/exp_$3"_"servers_$1"_"threads_$4"_"rates

i=0

for client in $(cat clients); do
  echo "Starting $client..."
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$client" "mkdir -p $LOG_DIR"
  ssh -oStrictHostKeyChecking=no "$CURRENT_USER@$client" "LD_LIBRARY_PATH=/usr/local/lib nohup $EXE_HOME/driver -db ethereum -threads $1 -P $EXE_HOME/workloads/workloada.spec -endpoint localhost:8545 -txrate $4 -wt 60 > $LOG_DIR/client_$client"_"$1 2>&1 &"
done
#for host in `cat $HOSTS`; do
#  let n=i/2
#  let i=i+1
#  if [[ $n -eq $2 ]]; then
#    #cd $ETH_HOME/../src/ycsb
#    cd $EXE_HOME
#    #both ycsbc and smallbank use the same driver
#    nohup ./driver -db ethereum -threads $1 -P workloads/workloada.spec -endpoint $host:8545 -txrate $4 -wt 60 > $LOG_DIR/client_$host"_"$1 2>&1 &
#  fi
#done
#
