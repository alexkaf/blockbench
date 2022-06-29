import matplotlib.pyplot as plt
import sys

results = sys.argv[1]
from_block = int(sys.argv[2])
to_block = int(sys.argv[3])


def filter_by_block(file_name, start_block, end_block):
    block_number = []
    txs_per_second = []
    with open(file_name) as results_file:
        for line in results_file.readlines():
            line = line.strip('\n')
            split = line.split(', ')
            block = int(split[0])

            if start_block <= block <= end_block:
                block_number += [block]
                txs_per_second += [int(split[1])]

    return block_number, txs_per_second


def triple_average(filtered_blocks, filtered_pace):
    triple_blocks = []
    triple_pace = []
    for idx, block in enumerate(filtered_blocks):
        if idx == 0 or idx == len(filtered_blocks) - 1:
            continue

        triple_blocks += [block]
        triple_pace += [(filtered_pace[idx - 1] + filtered_pace[idx] + filtered_pace[idx + 1]) / 3]

    return triple_blocks, triple_pace


blocks, pace = filter_by_block(results, from_block, to_block)
tr_blocks, tr_pace = triple_average(blocks, pace)

plt.plot(blocks, pace)
plt.plot(tr_blocks, tr_pace)
plt.title('txs/sec: 40.000txs')
plt.xlabel('Block Number')
plt.ylabel('txs/sec')
plt.show()
