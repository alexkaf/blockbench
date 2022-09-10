//
//  ycsbc.cc
//  YCSB-C
//
//  Created by Jinglei Ren on 12/19/14.
//  Copyright (c) 2014 Jinglei Ren <jinglei@ren.systems>.
//

#include <cstring>
#include <string>
#include <iostream>
#include <fstream>
#include <future>
#include <atomic>
#include <sstream>
#include <unordered_map>
#include "utils.h"
#include "eth.h"

using namespace std;

std::unordered_map<string, double> pendingtx;
// locking the pendingtx queue
SpinLock txlock;
SpinLock nonceLock;

struct Properties {
    int txrate;
    std::string endpoint;
    int txcount;
    int threads;
    int accounts;
};

bool StrStartWith(const char *str, const char *pre);
void ParseCommandLine(int argc, const char *argv[], Properties *props);

int main(const int argc, const char *argv[]) {
  Properties props;

  ParseCommandLine(argc, argv, &props);

  std::cout << "Endpoint: " << props.endpoint <<std::endl;
  std::cout << "Transactions: " << props.txcount <<std::endl;
  std::cout << "Threads: " << props.threads <<std::endl;
  std::cout << "Rate: " << props.txrate <<std::endl;
  std::cout << "Accounts: " << props.accounts <<std::endl;
  
  Eth eth(props.endpoint, &nonceLock, &txlock, &pendingtx);
  eth.send_transaction();
}

void ParseCommandLine(int argc, 
                      const char *argv[], 
                      Properties *properties) {
  int argindex = 1;
  while (argindex < argc && StrStartWith(argv[argindex], "-")) {
    if (strcmp(argv[argindex], "-threads") == 0) {
      argindex++;
      if (argindex >= argc) {
        exit(0);
      }
      properties->threads = std::stoi(argv[argindex]);
      argindex++;
    } else if (strcmp(argv[argindex], "-endpoint") == 0) {
      argindex++;
      if (argindex >= argc) {
        exit(0);
      }
      properties->endpoint = argv[argindex];
      argindex++;
    } else if (strcmp(argv[argindex], "-txrate") == 0) {
      argindex++;
      if (argindex >= argc) {
        exit(0);
      }
      properties->txrate = std::stoi(argv[argindex]);
      argindex++;
    } else if (strcmp(argv[argindex], "-txcount") == 0) {
      argindex++;
      if (argindex >= argc) {
        exit(0);
      }
      properties->txcount = std::stoi(argv[argindex]);
      argindex++;
    }
    else if (strcmp(argv[argindex], "-accounts") == 0) {
      argindex++;
      if (argindex >= argc) {
        exit(0);
      }
      properties->accounts = std::stoi(argv[argindex]);
      argindex++;
    }
    else {
      cout << "Unknown option '" << argv[argindex] << "'" << endl;
      exit(0);
    }
  }

  if (argindex == 1 || argindex != argc) {
    exit(0);
  }
}

inline bool StrStartWith(const char *str, const char *pre) {
  return strncmp(str, pre, strlen(pre)) == 0;
}
