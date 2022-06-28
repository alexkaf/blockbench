#!/bin/bash

HERE=$(dirname "$0")

git clone https://github.com/mrtazz/restclient-cpp.git

sudo apt-get install -y autotools-dev automake libtool libcurl4-nss-dev
git apply "$HERE"/lcurl.patch

cd restclient-cpp

pwd

./autogen.sh
./configure
pwd
ls
sudo make install