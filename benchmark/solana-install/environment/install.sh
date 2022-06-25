#!/bin/bash

HERE=$(dirname "$0")
source "$HERE/../env.sh"
PACKAGES=$HERE/packages

"$PACKAGES"/system.sh
"$PACKAGES"/node.sh
"$PACKAGES"/cargo.sh