from get_min_max import parse_sender_logs
import matplotlib.pyplot as plt


def parse_all_throughput(logs_file):
    timestamps = []
    throughput = []
    slots = []
    with open(logs_file) as rates:
        for rate in rates.readlines():
            rate = rate.split(', ')
            try:
                slots += [int(rate[0])]
            except ValueError:
                continue
            throughput += [int(rate[1])]
            timestamps += [int(rate[2])]

    return slots, throughput, timestamps


def collect_throughput(sender_logs, logs_file):
    min_slot, max_slot = parse_sender_logs(sender_logs)
    slots, throughput, timestamps = parse_all_throughput(logs_file)

    filtered_throughput = []
    filtered_timestamps = []

    for idx, slot in enumerate(slots):
        if min_slot <= slot <= max_slot:
            filtered_throughput += [throughput[idx]]
            filtered_timestamps += [timestamps[idx]]

    filtered_timestamps = list(map(lambda x: x - filtered_timestamps[0], filtered_timestamps))
    return filtered_throughput, filtered_timestamps


def remove_zeros(throughput_list, timestamps_list):
    temp_timestamps = []
    temp_throughput = []
    for idx, current_throughput in enumerate(throughput_list):
        if not current_throughput == 0:
            temp_throughput += [current_throughput]
            temp_timestamps += [timestamps_list[idx]]
    return temp_throughput, temp_timestamps


def average_throughput(logs_file):
    _, throughput, _ = parse_all_throughput(logs_file)
    return sum(throughput) / len(throughput)


def smoothen_data(throughput_list, timestamps_list, smoothen_factor):
    if smoothen_factor == 0:
        return throughput_list, timestamps_list

    temp_throughput, temp_timestamps = remove_zeros(throughput_list, timestamps_list)

    smooth_throughput = []
    for idx, current_throughput in enumerate(temp_throughput[1:-1]):
        smooth_throughput += [sum(temp_throughput[idx-1:idx+1]) / 3]

    return smoothen_data(smooth_throughput, temp_timestamps[1:-1], smoothen_factor - 1)


if __name__ == '__main__':
    sender_logs_sol = '/home/alexandros/Documents/blockbench/benchmark/solana-install/logs_40000.txt'
    throughput_log_sol = '../solana/40000_solana_txsPerSecond'

    sender_logs_eth = '/home/alexandros/Documents/blockbench/benchmark/solana-install/40000eth_logs.txt'
    throughput_log_eth = '../ethereum/40000_4_nodes.txt_txsPerSecond'

    thrput_sol, tstamps_sol = collect_throughput(sender_logs_sol, throughput_log_sol)
    thrput_nz_sol, tstamps_nz_sol = remove_zeros(thrput_sol, tstamps_sol)

    thrput_eth, tstamps_eth = collect_throughput(sender_logs_eth, throughput_log_eth)
    thrput_nz_eth, tstamps_nz_eth = remove_zeros(thrput_eth, tstamps_eth)
    print(sum(thrput_eth))
    plt.plot(tstamps_nz_sol, thrput_nz_sol)
    plt.plot(tstamps_nz_eth, thrput_nz_eth)
    plt.legend(['Solana', 'Ethereum'])
    # plt.plot(tstamps_nz_sol, thrput_nz_sol)
    plt.show()
