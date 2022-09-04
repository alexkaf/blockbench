import os 
import matplotlib.pyplot as plt

donothing = {
    'tps': [106.46, 112.6, 115.77, 106.27, 100.28, 96.24],
    'tps-analytic': [
        [111, 106.36, 102.02],
        [122.36, 104.34, 111.1],
        [122.88, 121.93, 102.52],
        [113.63, 100.37, 104.83],
        [105.32, 91.4, 104.14],
        [103.4, 77.73, 107.61]
    ],
    'latency': [10.42, 17.32, 19.97, 14.83, 10.79, 9.53],
    'latency-analytic': [
        [11.9, 10.14, 9.22],
        [8.77, 19.5, 23.71],
        [16, 14.15, 29.76],
        [15.73, 9.56, 19.2],
        [8.58, 11.3, 12.5],
        [10.91, 8.79, 8.91]
    ],
    'blocktime': [11.53, 13.92, 12.99, 10.81, 10.79, 9.41],
    'blocktime-analytic': [
        [13.2, 12.85, 8.55],
        [6.36, 14.2, 21.2],
        [15, 10.85, 13.14],
        [13.5, 9.75, 9.2],
        [7.4, 13.14, 11.85],
        [8.55, 10.27, 11.26],
    ],
    'totaltime': [94.01, 89.18, 86.96, 94.33, 100.12, 106.04],
    'totaltime-analytic': [
        [90.02, 94.01, 98.01],
        [81.72, 95.83, 90],
        [81.37, 82, 97.53],
        [88, 99.62, 95.39],
        [94.94, 109.4, 96.02],
        [96.64, 128.63, 92.86],
    ],
    'tpb': [1305.55, 1499.99, 1388.88, 1149.59, 1136.36, 867.34],
    'tpb-analytic': [
        [1666.66, 1250, 1000],
        [833.33, 1666.66, 2000],
        [1666.66, 1250, 1250],
        [1428.57, 1111.11, 909.09],
        [909.09, 1250, 1250],
        [1000, 833.33, 768.69],
    ],
    'ingress': [0, 1277584, 2823632, 6712920, 16167316, 18019917],
    'ingress-analytic': [
        [0, 0, 0],
        [1295049, 1266848, 1270856],
        [2829577, 2821079, 2820240],
        [6485236, 7216588, 6436938],
        [10452602, 17085210, 20964137],
        [12154111, 1617458, 25088183],
    ],
    'egress': [0, 1277584, 2823640, 13182974, 16167348, 18019911],
    'egress-analytic': [
        [0, 0, 0],
        [1295049, 1268848, 1270856],
        [2829673, 2802983, 280264],
        [13347829, 13278921, 12922174],
        [10452698, 17085114, 20964233],
        [12154111, 16517458, 25088165],
    ]
}


nodes = [1, 2, 4, 8, 12, 14]

min_latency = []
max_latency = []

fig, ax = plt.subplots()

for latency in donothing['latency-analytic']:
    min_latency += [min(latency)]
    max_latency += [max(latency)]

# ax.boxplot(donothing['latency-analytic'], positions=nodes, showmeans=True)
plt.plot(nodes, donothing['latency'])
plt.plot(nodes, donothing['blocktime'])
plt.show()