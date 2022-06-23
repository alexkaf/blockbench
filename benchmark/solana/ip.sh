#!/bin/bash

args=($(ip r))

echo "${args[2]}"