import os 
import sys  

sys.path.append('..')

import config
import raw
import numpy as np
import matplotlib.pyplot as plt
from parse_latencies import parse_file

class Getter:
    @staticmethod
    def get_blockchains(blockchain_a, blockchain_b):        
        if blockchain_a is None and blockchain_b is None:
            return config.BLOCKCHAIN[0], config.BLOCKCHAIN[1]
        
        if blockchain_b is None:
            return blockchain_a, blockchain_a
        
        return blockchain_a, blockchain_b

    @staticmethod
    def get_metric(metric_a, metric_b):
        if metric_a is None and metric_b is None:
            return config.METRICS[0], config.METRICS[1]

        if metric_b is None:
            return metric_a, metric_a
        
        return metric_a, metric_b

    @staticmethod
    def get_data(experiment, blockchain, metric, nodes):
        if nodes is None or len(nodes) == len(raw.data[experiment][blockchain][metric]):
            return raw.data[experiment][blockchain][metric]
        
        node_idxs = [config.NODES.index(node) for node in nodes]
        return [raw.data[experiment][blockchain][metric][node] for node in node_idxs]

    @staticmethod
    def get_range(experiment, blockchain, metric, nodes):
        metric = '{}-analytic'.format(metric)
        if nodes is None or len(nodes) == len(raw.data[experiment][blockchain][metric]):
            return raw.data[experiment][blockchain][metric]
        
        node_idxs = [ config.NODES.index(node) for node in nodes]
        return [raw.data[experiment][blockchain][metric][node] for node in node_idxs]

    @staticmethod
    def get_saturation(metric):
        return raw.data['saturation_sol']['rate'], raw.data['saturation_sol'][metric]

    @staticmethod
    def get_gas():

        gas_limit = raw.data['gas_eth']['gas']
        tpb = raw.data['gas_eth']['tpb']
        latency = raw.data['gas_eth']['latency']

        gas_limit = map(lambda x: int(x, 16), gas_limit)

        return list(gas_limit), tpb, latency

class Results:

    _experiment = 'donothing'
    
    blockchain_a = 'eth'
    blockchain_b = 'sol'

    metric_a = 'latency'
    metric_b = 'latency'

    _saturation = False
    _nodes = config.NODES
    _tps = 2000
    _plot = None

    def __init__(self, experiments_directory):
        self.directory = experiments_directory

    def experiment(self, experiment='donothing'):
        self._experiment = experiment
        return self

    def blockchain(self, blockchain_a=None, blockchain_b=None):
        blockchain_a, blockchain_b = Getter.get_blockchains(blockchain_a, blockchain_b)
        self.blockchain_a = blockchain_a
        self.blockchain_b = blockchain_b
        return self

    def metrics(self, metric_a=None, metric_b=None):
        metric_a, metric_b = Getter.get_metric(metric_a, metric_b)
        self.metric_a = metric_a
        self.metric_b = metric_b
        
        return self

    def nodes(self, *args):
        if not args:
            return self 

        self._nodes = []
        for node in args:
            if node not in config.NODES:
                raise ValueError('Nodes can have any value in: {}'.format(','.join(config.NODES)))
            else:
                self._nodes += [node]
        
        return self

    def saturation(self):
        self._saturation = True
        return self

    def plot(self, plot_type=None):
        data_a = \
            Getter.get_data(self._experiment, 
                            self.blockchain_a,
                            self.metric_a,
                            self._nodes)
        data_b = \
            Getter.get_data(self._experiment, 
                            self.blockchain_b,
                            self.metric_b,
                            self._nodes)

        range_a = \
            Getter.get_range(self._experiment, 
                            self.blockchain_a,
                            self.metric_a,
                            self._nodes)

        range_b = \
            Getter.get_range(self._experiment, 
                            self.blockchain_b,
                            self.metric_b,
                            self._nodes)

        self._plot = Plot(self._experiment, self._nodes, self.blockchain_a, self.blockchain_b, self.metric_a, self.metric_b, self._tps, data_a, data_b, range_a, range_b, self.directory)

        return self._plot
    
    def tps(self, tps=2000):
        self._tps = tps
        return self

class Plot:
    _title = None
    _legend = None
    _axes = None
    ax_twinx = None

    def __init__(self, experiment, nodes, blockchain_a, blockchain_b, metric_a, metric_b, tps,  data_a, data_b, range_a, range_b, experiments_directory=None):
        plt.clf()

        self.experiments_directory = experiments_directory
        self.experiment = experiment
        self.nodes = nodes
        self._tps = tps

        self.metric_a = metric_a
        self.metric_b = metric_b

        self.blockchain_a = blockchain_a
        self.blockchain_b = blockchain_b

        self.data_a = data_a
        self.data_b = data_b

        self.range_a = range_a
        self.range_b = range_b

        self.single_data = blockchain_a == blockchain_b and metric_a == metric_b


    def log(self):
        plt.yscale('log')
        return self

    def saturation(self):
        rate, data = Getter.get_saturation('tps')

        plt.plot(rate, rate)
        plt.plot(rate, data)
        self.legend(['Send Rate (tps)', 'Response'])
        return self 

    def gas(self, metric='latency'):
        gas, tpb, latency = Getter.get_gas()
    
        gas = list(map(lambda x: hex(x), gas))

        # tpb = [tpb[idx] for idx in sort_idx]
        # latency = [latency[idx] for idx in sort_idx]

        positions = list(range(1, len(gas) + 1))

        if metric == 'latency':
            plt.bar(positions, latency)
        else:
            plt.bar(positions, tpb)

        # positions = list(range(1, len(gas) + 1))
        plt.xticks(positions, gas, rotation=45)
        # plt.xlabel('Block Gas Limit')
        plt.xlabel('Block Gas Limit')
        return self

    def latency(self, plot_type='line', bins=100):

        rate, latency = Getter.get_saturation('latency')

        if plot_type == 'line':
            plt.plot(rate, latency)
        elif plot_type == 'hist':
            experiment_path = os.path.join(self.experiments_directory, 'sat_{}'.format(self._tps))
            _, latencies, _, _ = parse_file(experiment_path)

            plt.hist(latencies, bins)

        return self

    def line(self):
        plt.plot(self.nodes, self.data_a)

        if not self.single_data:
            plt.plot(self.nodes, self.data_b)

        return self

    def bar(self):
        positions_offset = list(range(len(self.nodes)))

        position_a = [position - 0.2 for position in positions_offset]
        position_b = [position + 0.2 for position in positions_offset]
        plt.bar(position_a, self.data_a, width=0.4)
        plt.bar(position_b, self.data_b, width=0.4)

        plt.xticks(positions_offset, self.nodes)
        return self

    def load_data(self, blockchain):
        all_latencies = []
        for experiment_idx in config.ID:
            for node in self.nodes:
                file_name = '{}_{}_{}_{}'.format(self.experiment, node, blockchain, experiment_idx)
                file_path = os.path.join(self.experiments_directory, file_name)
                
                _, latencies, _, _ = parse_file(file_path)
        
                all_latencies += latencies
        return all_latencies


    def histogram(self, blockchain, bins=100, percentile=None):
        data = self.load_data(blockchain)
        
        plt.hist(data, bins=bins)
        self.title('Latency Distribution')
        return self

    def range(self):
        if not self.single_data:
            return self

        minimums = [min(ranges) for ranges in self.range_a]
        maximums = [max(ranges) for ranges in self.range_b]
        plt.fill_between(self.nodes, minimums, maximums, alpha=0.5)

        return self

    def box(self):
        if not self.single_data:
            return self

        plt.boxplot(self.range_a, positions=self.nodes)

        return self

    def make_title(self):
        if self._title is not None:
            return 
             
        if self.metric_a == self.metric_b:
            self._title = self.metric_a.capitalize()
        else:
            self._title = '{}: {} vs {}'.format(self.blockchain_a.upper(), self.metric_a.capitalize(), self.metric_b.capitalize())

        plt.title(self._title)

    def title(self, title=None):
        self._title = title
        plt.title(self._title)

        return self

    def make_legend(self):
        if self._legend is not None:
            return 
        
        if self.single_data:
            return 

        if self.blockchain_a != self.blockchain_b:
            self._legend = [self.blockchain_a, self.blockchain_b]
        
        if self.metric_a != self.metric_b:
            self._legend = [self.metric_a, self.metric_b]
        
        plt.legend(self._legend)

        return self

    def ylim(self, limit):
        plt.ylim(limit)
        return self

    def legend(self, legend=None):
        self._legend = legend
        plt.legend(self._legend)

        return self 

    def make_axes(self):
        # plt.xlabel('Nodes')
        if self._axes is not None:
            return

        if self.metric_a != self.metric_b:
            self._axes = '{} / {}'.format(config.UNITS[self.metric_a], config.UNITS[self.metric_b])
            # self._axes = config.UNITS[self.metric_a]
            # self.ax_twinx.set_ylabel(config.UNITS[self.metric_b])
        else:
            self._axes = config.UNITS[self.metric_a]

        plt.ylabel(self._axes)

        return self

    def axes(self, axes=None):
        self._axes = axes

        plt.ylabel(self._axes)

        self.make_axes()
        return self

    def show(self):
        self.make_title()
        self.make_legend()
        self.make_axes()
        plt.show()


if __name__ == '__main__':
    path = '/home/alexandros/Desktop/new_results'

    x = Results(path)
    # x.nodes(2, 4, 8)
    # x.experiment().plot().bar().show()
    # x.experiment('kvstore').blockchain().metrics('tps').plot().set_ylim([0, 140]).line().title('Alex').show()
    # x.plot().latency('hist', 2000).show()
    x.plot().gas('latency').log().show()
    # print(x.blockchain_b)
    # x.plot_vs('donothing', 'totaltime', 'eth', 'sol')