import matplotlib.pyplot as plt
from parse_latencies import *
import sys 
import os


def collect_experiments(directory):
    experiments = {}
    results = sorted(os.listdir(directory))
    
    for file_name in results:
        if not os.path.isfile(os.path.join(directory, file_name)):
            continue
        experiment = file_name.split('_')[0]
        blockchain = file_name.split('_')[2]

        if not experiment in experiments.keys():
            experiments[experiment] = {}

        if not blockchain in experiments[experiment].keys():
            experiments[experiment][blockchain] = {
                'nodes': [],
                'Transactions Per Second': [],
                'Average Latency (s)': [],
                'Total Time (s)': []
            }
        
        experiments[experiment][blockchain]['nodes'] += [int(file_name.split('_')[1])]

    for experiment in experiments.keys():
        for blockchain in experiments[experiment].keys():
            experiments[experiment][blockchain]['nodes'] = sorted(experiments[experiment][blockchain]['nodes'])

    return experiments


def collect_data(directory, experiments_dict):
    for experiment in experiments_dict.keys():
        for blockchain in experiments_dict[experiment].keys():
            for node in experiments_dict[experiment][blockchain]['nodes']:
                file_path = os.path.join(directory, '{}_{}_{}'.format(experiment, node, blockchain))

                blocks, latencies, total_time = parse_file(file_path)
                average = average_latency(latencies)
                blocks_list, txs_per_blk = txs_per_block(blocks)
                total_txs = len(blocks)

                experiments_dict[experiment][blockchain]['Average Latency (s)'] += [average]
                experiments_dict[experiment][blockchain]['Transactions Per Second'] += [1e9 * len(latencies) / total_time]                
                experiments_dict[experiment][blockchain]['Total Time (s)'] += [total_time / 1e9]

    experiments_dict['smallbank']['sol']['nodes'] += [14]
    experiments_dict['smallbank']['sol']['Average Latency (s)'] += [50]
    experiments_dict['smallbank']['sol']['Transactions Per Second'] += [80]
    experiments_dict['smallbank']['sol']['Total Time (s)'] += [150]



def make_plots(directory, experiments_dict):
    blockchains = set({})
    experiments = set({})
    experiment_types = set({})

    for experiment in experiments_dict.keys():
        experiments.add(experiment)
        for blockchain in experiments_dict[experiment].keys():
            blockchains.add(blockchain)
            for exp_type in experiments_dict[experiment][blockchain].keys():
                experiment_types.add(exp_type)

    experiment_types.remove('nodes')
    experiments = sorted(list(experiments))
    blockchains = sorted(list(blockchains))
    experiment_types = sorted(list(experiment_types))

    for experiment in experiments:
        for experiment_type in experiment_types:
            make_plot(directory, experiments_dict, experiment, experiment_type, blockchains)
            make_barplot(directory, experiments_dict, experiment, experiment_type, blockchains)

            # type_name = [name.lower() for name in experiment_type.split()]
            # plot_name = '_'.join([experiment.lower(), '_'.join(type_name)])
            # plot_path = os.path.join(directory, 'plots', '{}.png'.format(plot_name))
            # plt.show()
            # plt.savefig(plot_path)
        #     break
        # break
        # plt.savefig()
        # break
            

def make_plot(directory, experiments_dict, experiment, experiment_type, blockchains):
    plt.clf()

    for blockchain in blockchains:
        nodes = experiments_dict[experiment][blockchain]['nodes']
        data = experiments_dict[experiment][blockchain][experiment_type]
        
        if blockchain == 'eth':
            line = plt.plot(nodes, data, color=(128/256, 128/256, 128/256),marker='X')
        else:
            line = plt.plot(nodes, data, color=(127/256, 0/256, 255/256), marker='X')


    plt.title('{}: {}'.format(experiment, experiment_type), fontname="Times New Roman Bold")
    plt.xlabel('Nodes')
    plt.xticks(labels=nodes, ticks=nodes)
    plt.ylabel(experiment_type)

    blockchain_legend = ['Solana' if bc == 'sol' else 'Ethereum' for bc in blockchains]
    plt.legend(blockchains)

    plt.yscale('log')
    type_name = [name.lower() for name in experiment_type.replace('(s)', '').split()]
    plot_name = '_'.join([experiment.lower(), '_'.join(type_name)])
    plot_path = os.path.join(directory, 'plots', '{}.png'.format(plot_name))

    # plt.show()
    # plt.savefig(plot_path, transparent=True)
    plt.savefig(plot_path)

def make_barplot(directory, experiments_dict, experiment, experiment_type, blockchains):
    plt.clf()

    width = 0.4
    placement = -width/2

    for blockchain in blockchains:
        nodes = experiments_dict[experiment][blockchain]['nodes']
        data = experiments_dict[experiment][blockchain][experiment_type]
        x_idx = list(range(1, len(nodes) + 1))
        
        bar_x = [idx + placement for idx in x_idx]

        if blockchain == 'eth':
            plt.bar(bar_x, data, width, color=(128/256, 128/256, 128/256))
        else:
            plt.bar(bar_x, data, width, color=(127/256, 0/256, 255/256))
        placement += width

    plt.title('{}: {}'.format(experiment, experiment_type), fontname="Times New Roman Bold")
    plt.xlabel('Nodes')
    plt.xticks(labels=nodes, ticks=x_idx)
    plt.ylabel(experiment_type)

    blockchain_legend = ['Solana' if bc == 'sol' else 'Ethereum' for bc in blockchains]
    plt.legend(blockchain_legend)

    plt.yscale('log')
    type_name = [name.lower() for name in experiment_type.replace('(s)', '').split()]
    plot_name = '_'.join([experiment.lower(), '_'.join(type_name)])
    plot_path = os.path.join(directory, 'bars', '{}.png'.format(plot_name))

    # plt.show()
    plt.savefig(plot_path, transparent=True)

if __name__ == '__main__':
    results_directory = sys.argv[1]
    experiments = collect_experiments(results_directory)
    collect_data(results_directory, experiments)
    make_plots(results_directory, experiments)