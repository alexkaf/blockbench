import math
import matplotlib.pyplot as plt


def parse_file(file_name):
    block = []
    latency = []
    start = math.inf
    end = -start

    with open(file_name) as latencies:
        for line in latencies.readlines()[1:]:
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

    return block, latency, end - start


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


if __name__ == '__main__':
    file = '../../../macro/kvstore/results/eth/donothing/eth_12_nodes_latencies'
    # file = '../../../../benchmark/solana-install/all'

    blocks, latencies, total_time = parse_file(file)
    average = average_latency(latencies)

    blocks_list, txs_per_blk = txs_per_block(blocks)

    plt.plot(blocks_list, txs_per_blk)
    plt.show()
    print(average)
    print(1e9 * len(latencies) / total_time)
    print(total_time / 1e9)

