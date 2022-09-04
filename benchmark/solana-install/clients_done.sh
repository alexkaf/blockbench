#!/bin/bash

idx=0
for host in `cat hosts`; do
    if [[ $idx -lt $1 ]]; then
        scp ubuntu@$host:~/test.txt .test_$idx &
    fi
    let idx=$idx+1
done

wait
cat .test_* > .temp
rm .test_*

TESTS_DONE=$(cat .temp | grep End, | wc -l)

if [ "$TESTS_DONE" = "$1" ]; then
    echo true
else 
    echo $TESTS_DONE/$1
fi