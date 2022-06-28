import matplotlib.pyplot as plt

results = 'results'

results_block = []
results_txs = []

with open(results) as results:
    for line in results.readlines():
        line = line.strip('\n')
        split = line.split(', ')

        if split[-1].startswith('-'):
            continue

        results_block += [int(split[0])]
        results_txs += [int(split[1])]

txPerBlock = 'txPerBlock'
txPerBlock_block = []
txPerBlock_txs = []

with open(txPerBlock) as results:
    for line in results.readlines():
        line = line.strip('\n')
        split = line.split(', ')

        txPerBlock_block += [int(split[0])]
        txPerBlock_txs += [int(split[1])]

start_index = txPerBlock_block.index(results_block[0])
end_index = start_index + len(results_block)

txPerBlock_block = txPerBlock_block[start_index:end_index]
txPerBlock_txs = txPerBlock_txs[start_index:end_index]


txPerSecond = 'txPerSecond'
txPerSecond_block = []
txPerSecond_txs = []

with open(txPerSecond) as results:
    for line in results.readlines():
        line = line.strip('\n')
        split = line.split(', ')

        if int(split[0]) <= results_block[0]:
            continue

        if int(split[0]) >= results_block[-1]:
            break

        txPerSecond_block += [int(split[0])]
        txPerSecond_txs += [int(split[1])]



plt.plot(results_block, results_txs)
plt.plot(txPerBlock_block, txPerBlock_txs)
plt.plot(txPerSecond_block, txPerSecond_txs)
plt.show()