#!/bin/bash

HOSTNAME_VERSION=( $(hostname --version) )
HOSTNAME_VERSION=${HOSTNAME_VERSION[1]}
HOSTNAME_VERSION=$(echo $HOSTNAME_VERSION | cut -c 1)

if [ $HOSTNAME_VERSION -eq '3' ]
then
  IP=( $(hostname -I) )
  IP=${IP[0]}
else
  IP=$(hostname -i)
fi

echo $IP