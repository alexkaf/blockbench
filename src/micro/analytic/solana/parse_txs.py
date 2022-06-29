import sys

import matplotlib.pyplot as plt
import itertools


def group_by_block(driver_file):
    analytics = {}
    with open(driver_file) as file:
        for line in file.readlines():
            line = line.strip('\'n')
            line = line.split(', ')
            block_number = int(line[0])
            latency = int(line[1])
            if analytics.keys().__contains__(block_number):
                analytics[block_number] += [latency]
            else:
                analytics[block_number] = [latency]
    return analytics


def average_latency(value_map):
    analytics_values = list(itertools.chain(*list(value_map.values())))
    return sum(analytics_values) / len(analytics_values)


def tx_per_block(value_map):
    txs = {}
    for key in value_map.keys():
        txs[key] = len(value_map[key])
    return txs


results = sys.argv[1]
from_block = int(sys.argv[2])
to_block = int(sys.argv[3])


analytics = group_by_block(results)
avg = average_latency(analytics)
txs_per_block = tx_per_block(analytics)

# print(avg)
# print(txs_per_block)

print(sys.argv)
