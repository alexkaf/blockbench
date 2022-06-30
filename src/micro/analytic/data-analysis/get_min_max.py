import math


def parse_sender_logs(logs_file):
    min_slot = math.inf
    max_slot = -math.inf
    with open(logs_file) as logs:
        for line in logs.readlines():
            if line.startswith('First:'):
                slot = line.replace('First: ', '').strip('\n')
                if int(slot) < min_slot:
                    min_slot = int(slot)
            elif line.startswith('Last:'):
                slot = line.replace('Last: ', '').strip('\n')
                if int(slot) > max_slot:
                    max_slot = int(slot)

    return min_slot, max_slot


if __name__ == '__main__':
    log = '../../../../../benchmark/solana-install/logs.txt'
    print(parse_sender_logs(log))
