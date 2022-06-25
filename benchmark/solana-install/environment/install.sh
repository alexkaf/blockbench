#!/bin/bash

HERE=$(dirname "$0")
source "$HERE/../env.sh"
PACKAGES=$HERE/packages
SOLANA=$HERE/solana

"$PACKAGES"/system.sh
"$PACKAGES"/node.sh
"$PACKAGES"/cargo.sh
"$SOLANA"/install.sh