#!/bin/bash

sudo apt-get update
sudo apt-get upgrade -y
sudo apt install -y curl \
                    dirmngr \
                    apt-transport-https \
                    lsb-release \
                    ca-certificates \
                    vim \
                    libssl-dev \
                    libudev-dev \
                    pkg-config \
                    zlib1g-dev \
                    llvm \
                    clang \
                    cmake \
                    make \
                    libprotobuf-dev \
                    protobuf-compiler \
                    jq \
                    psmisc \
                    vim
                    wget \
                    build-essential \
                    software-properties-common \
                    lsb-release \
                    libelf-dev \
                    linux-headers-generic \
                    pkg-config \

wget https://apt.llvm.org/llvm.sh && chmod +x llvm.sh && ./llvm.sh 13 && rm -f ./llvm.sh