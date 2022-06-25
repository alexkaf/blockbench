#!/bin/bash

sudo apt update
sudo apt install -y nodejs
sudo apt install -y npm

sudo npm cache clean -f
sudo npm install -g n
sudo n stable