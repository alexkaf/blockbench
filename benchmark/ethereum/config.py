NODES = []
with open('./hosts') as hosts:
    for line in hosts.readlines():
        NODES += [line.strip('\n')]

partition_cmd = './partition.sh {} {} {} &'
TIMEOUT=150
