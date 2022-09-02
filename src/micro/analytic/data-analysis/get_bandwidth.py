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


def total_traffic(metrics_list):
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

def collect_ingress(nodes_count):
    # Collect metrics from nodes
    subprocess.call('./collect_raw_metrics.sh {}'.format(nodes_count), shell=True)

    metrics = parse_json_to_dict()
    return total_traffic(metrics)

if __name__ == '__main__':

    ingress, egress = collect_ingress(int(sys.argv[1]))

    print('Ingress:', ingress)
    print('Egress:', egress)