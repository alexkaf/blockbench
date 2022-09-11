import matplotlib.pyplot as plt
from raw import data 

nodes = [1, 2, 4, 8, 12, 14]

saturation_eth_tps = data['saturation_eth']['tps']
saturation_sol_tps = data['saturation_sol']['tps']

saturation_eth_latency = data['saturation_eth']['latency']
saturation_sol_latency = data['saturation_sol']['latency']

rate_eth = data['saturation_eth']['rate']
rate_sol = data['saturation_sol']['rate']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))

ax1.plot([200] + rate_sol, [200] + rate_sol, label='Send Rate')
ax1.plot(rate_eth, saturation_eth_tps, label='Ethereum')
ax1.plot(rate_sol, saturation_sol_tps, label='Solana')

ax1.set_xlabel('Send Rate')
ax1.set_ylabel('Response Rate (TPS)')
ax1.set_title('Saturation Experiment (TPS)')
ax1.legend()

ax2.plot(rate_eth, saturation_eth_latency, label='Ethereum')
ax2.plot(rate_sol, saturation_sol_latency, label='Solana')

ax2.set_xlabel('Send Rate')
ax2.set_ylabel('Latency (sec)')
ax2.set_title('Saturation Experiment (Latency)')
ax2.legend()


plt.show()