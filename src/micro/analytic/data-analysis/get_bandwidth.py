import subprocess
import sys
import json 


def parse_json_to_dict():
    file_name = 'bandwidth'
    with open(file_name) as bandwidth_contents:
        contents = bandwidth_contents.read()[1:-2]
        split_contents = map(lambda x: x.replace('\n', ''), contents.split('}\n{'))
        dictionaries_raw = map(lambda x: ''.join(['{', '{}'.format(x), '}']), split_contents)
        parsed = list(map(lambda x: json.loads(x), dictionaries_raw))
        
        return parsed


def total_traffic_eth(metrics_list):
    ingress = []
    egress = []
    
    metrics_to_collect = {
        'egress': 'p2p/egress.count', 
        'ingress': 'p2p/ingress.count'
    }

    for node_metrics in metrics_list:
        ingress += [node_metrics[metrics_to_collect['ingress']]]
        egress += [node_metrics[metrics_to_collect['egress']]]

    return ingress, egress


def parse_iftop_output(nodes_count):
    
    bandwidths = {
        'ingress': [], 
        'egress': []
    }

    for node in range(nodes_count):
        file_name = 'band_{}'.format(node)

        with open(file_name) as bandwidth_contents:
            lines = bandwidth_contents.readlines()
            
            lines.reverse()

            # sent, received, total = get_cumulative(lines)
            traffic = get_cumulative(lines)

            bandwidths['ingress'] += [convert_to_bytes(traffic[0])]
            bandwidths['egress'] += [convert_to_bytes(traffic[1])]

    return bandwidths['ingress'], bandwidths['egress']

def convert_to_bytes(data):
    try:
        int(data[-2])
        return float(data[:-1])
    except ValueError:
        if data[-2:] == 'KB':
            return float(data[:-2]) * 1e3
        elif data[-2:] == 'MB':
            return float(data[:-2]) * 1e6
        elif data[-2:] == 'GB':
            return float(data[:-2]) * 1e9


def get_cumulative(lines):
    for line in lines:
        if line.startswith('Cumulative'):
            if len(line) != 82:
                continue

            rest = line.split(':')[-1]
            rest = rest.strip(' ').strip('\n').split(' ')
            rest = list(filter(lambda x: x != '', rest))
            
            return rest

def collect_traffic(nodes_count, network):
    # Collect metrics from nodes
    if network == 'eth':
        subprocess.call('./collect_raw_metrics.sh {}'.format(nodes_count), shell=True)
        metrics = parse_json_to_dict()
        return total_traffic_eth(metrics)
    else:
        subprocess.call('./collect_io.sh {}'.format(nodes_count), shell=True)
        ingress, egress = parse_iftop_output(nodes_count)
        subprocess.call('./clear_bandwidth_files.sh', shell=True)
        return ingress, egress

if __name__ == '__main__':

    ingress, egress = collect_traffic(int(sys.argv[1]))

    print('Ingress:', ingress)
    print('Egress:', egress)