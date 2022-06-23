#!/bin/bash

SCRIPT_DIR="$(dirname "$(realpath "${BASH_SOURCE-$0}")")"

"$SCRIPT_DIR"/compile.sh "$@"
"$SCRIPT_DIR"/deploy.sh "$@"