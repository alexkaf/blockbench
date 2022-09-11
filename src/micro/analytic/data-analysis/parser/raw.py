donothing_eth = {
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

donothing_sol = {
    'tps': [124.5, 125.76, 123.96, 125.49, 131.78, 132.87],
    'tps-analytic': [
        [124.58, 124.8, 124.12],
        [125.58, 126.18, 125.54],
        [122.82, 124.01, 125.06],
        [122.86, 133.01, 120,86],
        [124.98, 136.4, 133.97],
        [126.7, 137.16, 134.75],
    ],
    'latency': [0.23, 0.36, 0.36, 0.41, 0.45, 0.45],
    'latency-analytic': [
        [0.23, 0.23, 0.23],
        [0.35, 0.36, 0.38],
        [0.35, 0.35, 0.39],
        [0.41, 0.42, 0.42],
        [0.45, 0.46, 0.46],
        [0.45, 0.45, 0.46],
    ],
    'blocktime': [],
    'blocktime-analytic': [
        [],
        [],
        [],
        [],
        [],
        [],
    ],
    'totaltime': [80.31, 79.50, 80.59, 79.79, 79.98, 75.43],
    'totaltime-analytic': [
        [80.26, 80.12, 80.56],
        [79.62, 79.25, 79.65],
        [81.41, 80.63, 79.75],
        [81.39, 75.17, 82.81],
        [80, 73.31, 74.64],
        [78.92, 72.9, 74.21],
    ],
    'tpb': [46.01, 46.57, 46.15, 47.17, 49,88, 50,21],
    'tpb-analytic': [
        [45.87, 46.08, 46.08],
        [46.5, 46.51, 46.72],
        [45.66, 46.29, 46.51],
        [46.08, 50, 45.45],
        [47.61, 51.28, 50.76],
        [48.07, 51.81, 50.76],
    ],
    'ingress': [0, 71650000, 99891666.67, 106570833.3, 108611110.7, 115642856.3],
    'ingress-analytic': [
        [0, 0, 0],
        [75350000, 70850000, 68750000],
        [105200000, 97775000, 96700000],
        [110625000, 102925000, 106162500],
        [112916666, 103416666, 109500000],
        [124357142, 110714285, 111857142],
    ],
    'egress': [0, 71750000, 1001750000, 10017500, 106850000, 10874444, 448999999.7],
    'egress-analytic': [
        [0, 0, 0],
        [75850000, 70100000, 69300000],
        [105625000, 98100000, 96800000],
        [110937500, 103312500, 106300000],
        [112916666, 103566666, 109750000],
        [124285714, 110714285, 1112000000],
    ]
}

kvstore_eth = {
    'tps': [38.08, 20.79, 28.78, 30.4, 31.73, 29.48],
    'tps-analytic': [
        [41.31, 27.02, 48.09],
        [24.7, 16.23, 21.45],
        [25.5, 29.61, 31.25],
        [25.26, 29.25, 36.7],
        [28.6, 43.95, 22.64],
        [38.91, 26.84, 22.69],
    ],
    'latency': [95.88, 178.81, 123.08, 117.93, 113.35, 135.78],
    'latency-analytic': [
        [84.62, 154,93, 48.09],
        [140.16, 243.15, 153.13],
        [149.32, 120.01, 99.93],
        [131.17, 125.68, 96.94],
        [135.43, 52.14, 152.48],
        [73.12, 150.72, 183.5],
    ],
    'blocktime': [8.87, 11.75, 11.11, 10.3, 10.67, 10.24],
    'blocktime-analytic': [
        [8.55, 11.7, 6.38],
        [11.37, 12.14],
        [13.31, 10.93, 9.11],
        [12.51, 10.51, 7.88],
        [11.56, 6.84, 13.62],
        [7.5, 10.9, 12.34]
    ],
    'totaltime': [272.68, 494.74, 349.8, 336.7, 339.57, 353.66],
    'totaltime-analytic': [
        [242.01, 370.03 ,206.02],
        [402.04, 615.98, 466.08],
        [392.01, 337.66, 319.95],
        [395.8, 341.86, 272.45],
        [349.64, 227.48, 441.6],
        [256.98, 372.57, 431.45]
    ],
    'tpb': [345.92, 274.02, 333.57, 303.57, 309.54, 314.14],
    'tpb-analytic': [
        [370.37, 344.82, 322.58],
        [303.03, 277.77, 270.27],
        [344.82, 333.33, 322.58],
        [312.5, 312.5, 285.71],
        [322.58, 303.03, 303.03],
        [333.33, 303.03, 306.06],
    ],
    'ingress': [0, 2332880, 4686530, 10148334, 15720399, 17775707],
    'ingress-analytic': [
        [0, 0, 0],
        [2375184, 2305200, 2318256],
        [4662274, 4667602, 4729716],
        [10345180, 10035328, 10064496],
        [15467944, 15921505, 15771750],
        [17687827, 17714774, 17924520],
    ],
    'egress': [0, 2332880, 9064317, 10148334, 15720399, 17775713],
    'egress-analytic': [
        [0, 0, 0],
        [2375184, 2305200, 2318256],
        [4662364, 4667512, 17863077],
        [10345090, 10035418, 10064496],
        [15467949, 15921500, 15771750],
        [17687845, 17714749, 17924545],
    ]
}

kvstore_sol = {
    'tps': [121.87, 123.44, 119.94, 125.3, 127.22, 130.79],
    'tps-analytic': [
        [121.59, 122.31, 121.73],
        [122.89, 122.2, 125.24],
        [120.68, 117.42, 121.74],
        [121.68, 118.49, 135.73],
        [131.73, 116.08, 133.85],
        [133.76, 134.45, 124.16],
    ],
    'latency': [0.23, 0.36, 0.41, 0.71, 0.48, 0.54],
    'latency-analytic': [
        [0.23, 0.24, 0.23],
        [0.35, 0.37, 0.36],
        [0.4, 0.43, 0.4],
        [1.118, 0.48, 0.47],
        [0.51, 0.45, 0.48],
        [0.5, 0.5, 0.54],
    ],
    'blocktime': [],
    'blocktime-analytic': [
        [],
        [],
        [],
        [],
        [],
        [],
    ],
    'totaltime': [82.04, 81.00, 83.38, 80.07, 78.98, 76.55],
    'totaltime-analytic': [
        [82.24, 81.75, 82.14],
        [81.36, 81.82, 79.84],
        [82.86, 85.16, 82.13],
        [82.17, 84.39, 73.67],
        [75.9, 86.14, 74.9],
        [74.75, 74.37, 80.53],
    ],
    'tpb': [45.04, 45.94, 44.84, 60.64, 48.27, 49.4],
    'tpb-analytic': [
        [44.64, 45.45, 45.04],
        [46.08, 45.66, 46.08],
        [45.04, 44.05, 45.45],
        [46.51, 84.39, 51.02],
        [49.75, 44.05, 51.02],
        [50.5, 50.76, 46.94],
    ],
    'ingress': [0, 71016666, 102625000, 116833333, 117222221, 119214285],
    'ingress-analytic': [
        [0, 0, 0],
        [72750000, 69850000, 70450000],
        [99925000, 103125000, 104825000],
        [120000000, 119750000, 110750000],
        [1499166666, 124333333, 117166666],
        [1288142857, 115142857, 114357142]
    ],
    'egress': [0, 71616666, 102808333, 117408333, 117222221, 119238095],
    'egress-analytic': [
        [0, 0, 0],
        [73300000, 70550000, 71000000],
        [100125000, 103175000, 105125000],
        [121375000, 119875000, 110975000],
        [1501666666, 1244166366, 117583333],
        [128142857, 115142857, 114428571],
    ]
}

smallbank_eth = {
    'tps': [37.33, 48.25, 43.09, 47, 45.64, 55.69],
    'tps-analytic': [
        [26.04, 35.96, 49.99],
        [44.68, 48.54, 51.54],
        [33.81, 45.48, 49.99],
        [43.38, 50.56, 47.06],
        [53.98, 42.91, 40.03],
        [74.86, 49.49, 42.72],
    ],
    'latency': [128.81, 71.13, 74.99, 66.42, 73.33, 64.29],
    'latency-analytic': [
        [191.82, 126.46, 68.17],
        [63.21, 79.9, 70.29],
        [76.62, 76.42, 71.93],
        [59.13, 67.7, 72.44],
        [39.14, 83.38, 97.48],
        [31.43, 74.05, 87.41],
    ],
    'blocktime': [9.76, 13.68, 11.78, 8.50, 10.04, 7.98],
    'blocktime-analytic': [
        [13.24, 9.15, 6.89],
        [13.68, 12.4],
        [15.5, 10.65, 9.21],
        [9.16, 7.7, 8.66],
        [8.42, 10.18, 11.52],
        [5.57, 8.47, 9.91],
    ],
    'totaltime': [287.35, 207.92, 238.52, 213.57, 222.07, 189.89],
    'totaltime-analytic': [
        [384.02, 278.03, 200.01],
        [223.78, 206, 194],
        [295.69, 219.86, 200.01],
        [230.5, 197.77, 212.45],
        [185.22, 233.02, 247.99],
        [133.57, 202.03, 234.07],
    ],
    'tpb': [366.6, 577.33, 500.83, 405.55, 454.18, 449.13],
    'tpb-analytic': [
        [384.61, 370.37, 344.82],
        [588.23, 588.23, 555.55],
        [526.31, 476.19, 500],
        [400, 416.66, 400],
        [476.19, 434.78, 451.57],
        [454.54, 476.19, 416.66],
    ],
    'ingress': [0, 1632040, 3293436, 7316987, 11908513, 13546661],
    'ingress-analytic': [
        [0, 0, 0],
        [1838320, 3367400, 4896120],
        [25979593, 29140125, 32410797],
        [63969583, 71283979, 78597061],
        [96994372, 108929856, 120936087],
        [108700385, 122400794, 135872746],
    ],
    'egress': [0, 1632040, 3293402, 7316987, 11908513, 13546661],
    'egress-analytic': [
        [0, 0, 0],
        [1838144, 1529255, 1528720],
        [3349164, 3260372, 3270672,],
        [7323492, 7314388, 7313082],
        [11783826, 11935484, 12006231],
        [13467623, 13700409, 13471952],
    ]
}

smallbank_solana = {
    'tps': [118.42, 121.8, 120.81, 125.55, 127.29, 125.34],
    'tps-analytic': [
        [118.21, 117.16, 119.89],
        [121.58, 122.11, 121.73],
        [121.06, 120.89, 120.49],
        [114.79, 133.07, 128.8],
        [120.36, 130.82, 130.7],
        [122.45, 126.19, 127.4],
    ],
    'latency': [0.25, 0.36, 0.4, 1.68, 0.52, 0.55],
    'latency-analytic': [
        [0.24, 0.24, 0.27],
        [0.37, 0.35, 0.36],
        [0.42, 0.4, 0.39],
        [2.62, 0.52, 1.92],
        [0.51, 0.53, 0.52],
        [0.55, 0.55, 0.57],
    ],
    'blocktime': [],
    'blocktime-analytic': [
        [],
        [],
        [],
        [],
        [],
        [],
    ],
    'totaltime': [84.44, 82.08, 82.76, 79.95, 78.28, 78.37],
    'totaltime-analytic': [
        [84.58, 85.35, 83.4],
        [82.24, 81.88, 82.14],
        [82.6, 82.7, 82.99],
        [87.11, 75.12, 77.62],
        [83.07, 76.43, 75.35],
        [81.66, 74.96, 78.49],
    ],
    'tpb': [44.24, 45.04, 45.24, 51.06, 48.4, 47.99],
    'tpb-analytic': [
        [44.24, 43.85, 44.64],
        [45.24, 45.04, 44.84],
        [45.66, 45.24, 44.84],
        [47.84, 49.5, 55.86],
        [45.45, 49.5, 50.25],
        [46.08, 47.3, 48.2],
    ],
    'ingress': [0, 72383333, 102583333, 114000000, 127444444, 124571428],
    'ingress-analytic': [
        [0, 0, 0],
        [76750000, 70100000, 70300000],
        [101675000, 101625000, 104450000],
        [115625000, 108875000, 117500000],
        [150083333, 119333333, 112916666],
        [122642857, 127500000, 123571428],
    ],
    'egress': [0, 72550000, 102883333, 114500000, 127694444,124761904],
    'egress-analytic': [
        [0, 0, 0],
        [77300000, 70600000, 69750000],
        [101850000, 102125000, 104675000],
        [116125000, 109000000, 118375000],
        [150250000, 119833333, 113000000],
        [122928571, 127571428, 123785714],
    ]
}

saturation_sol = {
    'rate': [400, 600, 800, 
             1000, 1200, 1400,
             1600, 1800, 2000, 
             2200, 2400, 2600, 
             2800, 3000, 3200, 
             3400, 3600, 3800, 
             4000],
    'tps': [364.66, 514.02, 654.29, 
            789.02, 944.03, 927.2,
            1051.35, 1238.91, 1244.48,
            1304.84, 1370.55, 1438.36,
            1453.07, 1524.73, 1504.63, 
            1595.85, 1669.15, 1588.63, 
            1503.35], 
    'latency': [0.46, 0.53, 0.58,
                0.56, 0.55, 0.58, 
                0.61, 0.66, 0.62, 
                0.63, 0.63, 0.64, 
                0.66, 0.67, 0.67, 
                0.67, 0.73, 0.77, 
                0.83]
}

saturation_eth = {
    'rate': [ 200, 400, 600, 
              800, 1000, 1200, 
              1400, 1600, 1800, 
              2000, 2200, 2400, 
              2600, 2800, 3000, 
              3200],
    'tps': [
        133.39, 274.24, 306.75, 303.49,
        223.25, 222.65, 260.9,
        255, 264.85, 290.73,
        363.25, 309.53, 314.3,
        248.25, 199.59, 220.45
    ],
    'blocktime': [
        15.88, 13.5, 14.33,
        12.87, 15.7, 14.55,
        15, 13.87, 13.18,
        14.2, 12.62, 12.85,
        11.25, 20.12, 19.3,
        15.3
    ],
    # 'latency': [
    #     13.04, 11.77, 17.74,
    #     32.29, 41.5, 46,
    #     45.15, 59.48, 61.89,
    #     47.25, 31.28, 51.81,
    #     47.03, 76.78, 79.35,
    #     85.4
    # ]
    'latency': [
        13.04, 11.77, 17.74,
        32.29, 41.5, 46,
        45.15, 59.48, 61.89,
        65.4, 62.4, 56.81,
        60.04, 76.78, 79.35,
        85.4
    ]
}

gas_eth = {
    'gas': ['0xccccc', '0x7ffff8','0xfffff0', '0x1ffffe0', '0x3ffffc0', '0x5ffffa0'], 
    'tpb': [0, 336.53, 625, 1000, 2000, 1250], 
    'latency': [0, 92.98, 21.48, 15.54, 29.92, 16.63]
}

data = {
    'donothing': {
        'eth': donothing_eth,
        'sol': donothing_sol
    },
    'kvstore': {
        'eth': kvstore_eth,
        'sol': kvstore_sol
    },
    'smallbank': {
        'eth': smallbank_eth,
        'sol': smallbank_solana
    },
    'saturation_sol': saturation_sol,
    'saturation_eth': saturation_eth,
    'gas_eth': gas_eth
}