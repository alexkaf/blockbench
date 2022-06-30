import matplotlib.pyplot as plt
from parse_txs_per_second import smoothen_data


def count_miners(miners):
    unique_miners = {}

    for miner in miners:
        if not miner in unique_miners.keys():
            unique_miners[miner] = 1
        else:
            unique_miners[miner] += 1
    return unique_miners


def get_blocks(blocks_log):
    block_numbers = []
    timestamps = []
    miners = []
    with open(blocks_log) as log:
        for line in log.readlines():
            split = line.strip('\n').split(', ')
            block_numbers += [int(split[0])]
            timestamps += [int(split[3])]
            miners += [split[2]]

    timestamps = list(map(lambda x: x - timestamps[0], timestamps))

    return timestamps, block_numbers, miners


def get_difficulty(difficulty_log):
    block_numbers = []
    difficulty = []
    with open(difficulty_log) as difficulties:
        for line in difficulties.readlines():
            split = line.strip('\n').split(', ')
            block_numbers += [int(split[0])]
            difficulty += [int(split[1])]
    return block_numbers, difficulty


def average_block_time(block_times):
    return sum(block_times) / len(block_times)


def canonicalize_difficulty(difficulty, block_time):
    max_difficulty = max(difficulty)
    max_block_time = max(block_time)

    difficulty = list(map(lambda x: x - (max_difficulty - max_block_time), difficulty))
    return difficulty


def calculate_block_time(block_timestamps):
    block_times = []
    for prev_block, current_block in zip(block_timestamps, block_timestamps[1:]):
        block_times += [current_block - prev_block]

    return block_times


if __name__ == '__main__':
    blocks_file = '../ethereum/blocks_4_nodes'
    difficulties_file = '../ethereum/diff_4'
    times, blocks, miners = get_blocks(blocks_file)
    block_times = calculate_block_time(times)
    miners = count_miners(miners)
    block_numbers, difficulties = get_difficulty(difficulties_file)

    # plt.plot(blocks, times)
    plt.plot(block_times)
    plt.title('Average block time: {}s'.format(round(average_block_time(block_times) / 1000, 2)))
    # plt.plot(canonicalize_difficulty(difficulties, block_times))

    # plt.bar(list(miners.keys()), list(miners.values()))
    plt.show()
