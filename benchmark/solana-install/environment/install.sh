#!/bin/bash

HERE=$(dirname "$0")
PACKAGES=$HERE/packages

"$PACKAGES"/system.sh
"$PACKAGES"/node.sh
"$PACKAGES"/cargo.sh
"$PACKAGES"/solana/install.sh