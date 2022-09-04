import math
import matplotlib.pyplot as plt
from get_bandwidth import collect_traffic
import sys

def parse_file(file_name):
    block = []
    latency = []
    start = math.inf
    end = -start

    with open(file_name) as latencies:
        for line in latencies.readlines():
            split = line.strip('\n').split(', ')

            if split[0] == 'Start':
                start_time = float(split[1])
                if start_time < start:
                    start = start_time
            elif split[0] == 'End':
                end_time = float(split[1])
                if end_time > end:
                    end = end_time
            else:
                try:
                    block += [int(split[0])]
                    latency += [float(split[2]) / 1e9]

                    # if float(split[2]) > 1656667470:
                    #     print(line)
                except (ValueError, IndexError):
                    continue
    return block, latency, (start, end), end - start

def get_starting_block(blocks):
    return min(blocks)

def get_ending_block(blocks):
    return max(blocks)

def average_latency(latency_list):
    return sum(latency_list) / len(latency_list)


def txs_per_block(block_list):
    txs = {}
    for block in block_list:
        if block in txs.keys():
            txs[block] += 1
        else:
            txs[block] = 1
    zipped = zip(list(txs.keys()), list(txs.values()))
    sorted_zip = sorted(zipped)
    tuples = zip(*sorted_zip)
    return [list(c_tuple) for c_tuple in tuples]


def average(data):
    return sum(data) / len(data)


def get_meta(file_name):
    return int(file_name.split('/')[-1].split('_')[1]), file_name.split('/')[-1].split('_')[2]

def eject_block_times(blocks, latencies, times):
    first_block = blocks[0]
    for idx, block in enumerate(blocks):
        if block != first_block:
            break
    
    first_tx = min(latencies[:idx])
    print(first_tx)


if __name__ == '__main__':
    file = sys.argv[1]

    blocks, latencies, time_bounds, total_time = parse_file(file)
    average_lat = average_latency(latencies)
    blocks_list, txs_per_blk = txs_per_block(blocks)

    # plt.plot(blocks_list, txs_per_blk)

    nodes_count, net = get_meta(file)

    ingress, egress = collect_traffic(nodes_count, net)
    
    eject_block_times(blocks, latencies, time_bounds)
    print('Total transactions: {}'.format(len(blocks)))
    print('Transactions per block: {}'.format(average(txs_per_blk)))
    print('Starting Block: {}'. format(get_starting_block(blocks)))
    print('Ending Block: {}'. format(get_ending_block(blocks)))
    print('Average latency: {}'.format(average_lat))
    print('TPS: {}'.format(1e9 * len(latencies) / total_time))
    print('Total time: {}'.format(total_time / 1e9))
    print('Average Ingress: {}'.format(average(ingress)))
    print('Average Egress: {}'.format(average(egress)))

