#!/bin/bash

CONTRACTS=""
function parse() {
mkdir -p deployed_programs

  for arg in "$@"; do
    case "$arg" in
      "-p" | "--program")
        shift
        CONTRACTS="$CONTRACTS $1"
        shift
        ;;
      "-a" | "--all")
        CONTRACTS=$(cat "$SCRIPT_DIR/programs")
        shift
    esac
  done
}

SCRIPT_DIR="$(dirname "$(realpath "${BASH_SOURCE-$0}")")"

source "$SCRIPT_DIR/env.sh"
parse "$@"

for contract in $CONTRACTS
do
  echo "Compiling $contract"
  PROGRAM_PATH="$SOL_PROGRAMS_DIR/$contract"

  cd "$PROGRAM_PATH" || exit
  PROGRAM_ID=$(cargo build-bpf)

  cd "$SCRIPT_DIR" || exit
done

