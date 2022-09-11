#!/bin/bash

for host in `cat hosts`; do
    ssh -oStrictHostKeyChecking=no "ubuntu@$host" "killall driver" &
done