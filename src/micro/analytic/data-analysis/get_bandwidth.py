import subprocess
import sys
import json 

nodes = sys.argv[1]
ingress_to_collect = [
    'p2p/ingress/eth/67/0x00.count', 
    'p2p/ingress/eth/67/0x01.count',
    'p2p/ingress/eth/67/0x03.count',
    'p2p/ingress/eth/67/0x04.count',
    'p2p/ingress/eth/67/0x07.count',
]

engress_to_collect = [
    'p2p/egress/eth/67/0x00.count', 
    'p2p/egress/eth/67/0x01.count',
    'p2p/egress/eth/67/0x03.count',
    'p2p/egress/eth/67/0x04.count',
    'p2p/egress/eth/67/0x07.count',
]

# Collect metrics from nodes
subprocess.call('./collect_raw_metrics.sh {}'.format(nodes), shell=True)


def parse_json_to_dict():
    file_name = 'bandwidth'
    with open(file_name) as bandwidth_contents:
        contents = bandwidth_contents.read()[1:-2]
        split_contents = map(lambda x: x.replace('\n', ''), contents.split('}\n{'))
        dictionaries_raw = map(lambda x: ''.join(['{', '{}'.format(x), '}']), split_contents)
        parsed = list(map(lambda x: json.loads(x), dictionaries_raw))
        
        return parsed


def collect_total_bytes(metrics_list):
    total_ingress = 0
    total_egress = 0
    
    for node_metrics in metrics_list:
        for egress_metric in engress_to_collect:
            total_egress += int(node_metrics[egress_metric])
        
        for ingress_metric in ingress_to_collect:
            total_ingress += int(node_metrics[ingress_metric])
    return total_egress, total_ingress


if __name__ == '__main__':
    metrics = parse_json_to_dict()
    ingress, egress = collect_total_bytes(metrics)

    print('Ingress:', ingress)
    print('Egress:', egress)