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
#include "timer.h"
#include "utils.h"
#include "eth.h"

using namespace std;

double sleepTime;
int totalTxs;
ofstream resultsFile("/home/ubuntu/test.txt");

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

int sender(Eth *eth, int ops, int rate) {

  for(int idx=0; idx<ops; idx++) {
    eth->send_transaction();
    utils::sleep(sleepTime);
  }
  return 1;
}

int monitor(Eth *eth) {
  int previousTip = eth->tip;
  int current_tip;
  double waitTime = 1.0;
  int found = 0;

  while (true) {
    current_tip = eth->get_tip_block_number();

    for (int current=previousTip+1; current<=current_tip; current++) {
      long block_time = utils::time_now();
      vector<std::string> currentBlockTxs = eth->poll_txs_by_block_number(current);

      txlock.lock();

      for (std::string tmp: currentBlockTxs) {
          std::string s = tmp.substr(1, tmp.length() - 2);
          if (pendingtx.find(s) != pendingtx.end()) {
            found++;
            resultsFile << current << ", " << s << ", " << block_time - pendingtx[s] << endl;
            pendingtx.erase(s);
          }
      }
      txlock.unlock();

      std::cout << "Found: " << found << std::endl;

      if (found == totalTxs) {
        resultsFile << "End, " << utils::time_now() << endl;
        break;
      }
    } 

    previousTip = current_tip;
    utils::sleep(waitTime);
  }

  return 1;
}

int main(const int argc, const char *argv[]) {
  Properties props;

  ParseCommandLine(argc, argv, &props);

  std::cout << "Endpoint: " << props.endpoint << std::endl;
  std::cout << "Transactions: " << props.txcount << std::endl;
  std::cout << "Threads: " << props.threads <<std::endl;
  std::cout << "Rate: " << props.txrate << std::endl;
  std::cout << "Accounts: " << props.accounts << std::endl;
  
  Eth eth(props.endpoint, &nonceLock, &txlock, &pendingtx);
  
  vector<future<int>> actual_ops;
  int ops_per_thread = props.txcount / props.threads;
  int rate_per_thread = props.txrate / props.threads;

  sleepTime = 1.0 / rate_per_thread;
  totalTxs = props.txcount;

  resultsFile << "Start, " << utils::time_now() << endl;

  for (int idx; idx<props.threads; idx++) {
    actual_ops.emplace_back(async(launch::async, sender, &eth, ops_per_thread, rate_per_thread));
  }

  actual_ops.emplace_back(async(launch::async, monitor, &eth));

  // for (int idx=0; idx<props.txcount; idx++) {
  //   eth.send_transaction();
  //   utils::sleep(0.5);
  // }
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
