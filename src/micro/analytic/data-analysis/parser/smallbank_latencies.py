import os 
import sys  
import math

sys.path.append('..')

import matplotlib.pyplot as plt
from raw import data 

import config
import numpy as np
import matplotlib.pyplot as plt
from parse_latencies import parse_file

DIRECTORY = '/home/alexandros/Desktop/new_results'

eth_latencies = []
for exp in range(1, 4):
    path = os.path.join(DIRECTORY, 'smallbank_8_eth_{}'.format(exp))

    _, latency, _, _ = parse_file(path)
    eth_latencies += latency

sol_latencies = []
for exp in range(1, 4):
    path = os.path.join(DIRECTORY, 'smallbank_8_sol_{}'.format(exp))

    _, latency, _, _ = parse_file(path)
    sol_latencies += latency


fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(16, 5))

ax1.hist(eth_latencies, bins=1000)
ax1.set_title("Ethereum Latencies")
ax1.set_xlabel('Transaction Latency (sec)')

ax2.hist(sol_latencies, bins=1000)
ax2.set_title("Solana Latencies")
ax2.set_xlabel('Transaction Latency (sec)')

ax2.set_xticks([0, 1, math.ceil(max(sol_latencies))])

ax3.hist(eth_latencies, bins=1000, label='Ethereum')
ax3.hist(sol_latencies, bins=1000, label='Solana')

_, ymax_eth = ax1.get_ylim()
_, ymax_sol = ax2.get_ylim()

ax3.set_ylim([0, 10 + min([ymax_eth, ymax_sol])])

ax3.set_title("Solana / Ethereum Latencies")
ax3.set_xlabel('Transaction Latency (sec)')
ax3.legend()

plt.show()
