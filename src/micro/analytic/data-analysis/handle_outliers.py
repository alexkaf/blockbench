import numpy as np 
from parse_latencies import parse_file

def get_percentile(file_name):
    block, latency, total = parse_file(file_name)
    as_array = np.percentile(latency,50)
    return as_array

if __name__ == '__main__':
    val = get_percentile('/home/alexandros/results/kvstore_12_eth')
    print(val)