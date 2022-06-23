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

solana-keygen new --no-bip39-passphrase -f -o "$SCRIPT_DIR/feePayer"
solana airdrop 1000 -k "$SCRIPT_DIR/feePayer"

source "$SCRIPT_DIR/env.sh"
parse "$@"

for contract in $CONTRACTS;
do
  echo "Deploying $contract"
  PROGRAM_PATH="$SOL_PROGRAMS_DIR/$contract"

  cd "$PROGRAM_PATH" || exit
  PROGRAM_ID=$(solana program deploy -k $SCRIPT_DIR/feePayer "$PROGRAM_PATH/target/deploy/$contract.so")
  echo $PROGRAM_ID
  read -ra pids <<< "$PROGRAM_ID"
  echo "${pids[2]}" > "$SCRIPT_DIR/deployed_programs/$contract"

  cd "$SCRIPT_DIR" || exit
done

