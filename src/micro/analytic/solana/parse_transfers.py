import matplotlib.pyplot as plt
import sys

results = sys.argv[1]
from_block = int(sys.argv[2])
to_block = int(sys.argv[3])

results_e = sys.argv[4]
from_block_e = int(sys.argv[5])
to_block_e = int(sys.argv[6])


def filter_by_block(file_name, start_block, end_block):
    block_number = []
    txs_per_second = []
    with open(file_name) as results_file:
        for line in results_file.readlines():
            line = line.strip('\n')
            split = line.split(', ')
            try:
                block = int(split[0])
            except:
                continue

            if start_block <= block <= end_block:
                block_number += [int(split[0])]
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

blocks_e, pace_e = filter_by_block(results_e, from_block_e, to_block_e)
tr_blocks_e, tr_pace_e = triple_average(blocks_e, pace_e)

sum_e = sum(pace) / len(blocks)
print(sum_e)

for _ in range(10):
    tr_blocks, tr_pace = triple_average(tr_blocks, tr_pace)

for _ in range(10):
    tr_blocks_e, tr_pace_e = triple_average(tr_blocks_e, tr_pace_e)

plt.plot(list(range(0, len(pace))), pace)
plt.plot(list(range(0, len(pace_e))), pace_e)
# plt.plot(blocks, pace)
plt.title('txs/sec: 40.000txs')
plt.xlabel('Block Number')
plt.ylabel('txs/sec')
plt.legend(['Ethereum', 'Solana'])
plt.show()
