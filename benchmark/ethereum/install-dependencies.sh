#!/bin/bash

HERE=$(dirname "$0")

sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum

sudo apt-get update
sudo apt-get install -y ethereum


git clone https://github.com/mrtazz/restclient-cpp.git

sudo apt-get install -y autotools-dev automake libtool libcurl4-nss-dev
git apply "$HERE"/lcurl.patch

cd restclient-cpp

./autogen.sh
./configure
sudo make install

cd "$HOME"/assesments/blockbench/src/macro/kvstore
make

cd ../smallbank
make

cd ../rust-driver
source "$HOME"/.cargo/env
cargo build