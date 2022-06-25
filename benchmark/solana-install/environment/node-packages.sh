#!/bin/bash

sudo apt update
sudo apt install -y nodejs
sudo apt install -y npm

npm cache clean -f
npm install -g n
sudo n stable