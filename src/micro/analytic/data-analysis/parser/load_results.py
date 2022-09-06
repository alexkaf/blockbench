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

class Results:

    _experiment = 'donothing'
    
    blockchain_a = 'eth'
    blockchain_b = 'sol'

    metric_a = 'latency'
    metric_b = 'latency'

    _nodes = config.NODES
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

        self._plot = Plot(self._experiment, self._nodes, self.blockchain_a, self.blockchain_b, self.metric_a, self.metric_b, data_a, data_b, range_a, range_b, self.directory)

        return self._plot

class Plot:
    _title = None
    _legend = None
    _axes = None
    ax_twinx = None

    def __init__(self, experiment, nodes, blockchain_a, blockchain_b, metric_a, metric_b, data_a, data_b, range_a, range_b, experiments_directory=None):
        plt.clf()

        self.experiments_directory = experiments_directory
        self.experiment = experiment
        self.nodes = nodes

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

    def line(self):

        plt.plot(self.nodes, self.data_a)

        if not self.single_data:
            # if self.metric_a != self.metric_b:
            #     ax = plt.gca()
            #     self.ax_twinx = ax.twinx()
            #     self.ax_twinx.plot(self.nodes, self.data_b)
            #     plt.ylim(min(min(self.data_a), min(self.data_b)), max(max(self.data_a), max(self.data_b)))
            # else:
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

    def legend(self, legend=None):
        self._legend = _legend
        plt.legend(self._legend)

        return self 

    def make_axes(self):
        plt.xlabel('Nodes')
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
    x.experiment('donothing').blockchain('eth').metrics('latency', 'blocktime').plot().line().title('Alex').box().show()
    # print(x.blockchain_b)
    # x.plot_vs('donothing', 'totaltime', 'eth', 'sol')