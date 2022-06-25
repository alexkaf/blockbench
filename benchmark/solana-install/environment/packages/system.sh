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