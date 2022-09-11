import matplotlib.pyplot as plt 
from raw import data

nodes = [1, 2, 4, 8, 12, 14]

# SMALLBANK
smallbank_eth = data['smallbank']['eth']
smallbank_sol = data['smallbank']['sol']

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(16, 5))
# fig.tight_layout()

#TPS
ax1.plot(nodes, smallbank_eth['tps'])
ax1.plot(nodes, smallbank_sol['tps'])

ax1.set_ylim([0, 20 + max(smallbank_sol['tps'])])

ax1.set_title('Transactions Per Second')
ax1.set_xlabel('Nodes')
ax1.set_ylabel('TPS')
ax1.figsize = (2, 2)
ax1.legend(['Ethereum', 'Solana'])


#Latency
ax2.plot(nodes, smallbank_eth['latency'])
ax2.plot(nodes, smallbank_sol['latency'])

ax2.set_ylim([0, 2 + max(smallbank_eth['latency'])])

ax2.set_title('Transaction Latency')
ax2.set_xlabel('Nodes')
ax2.set_ylabel('Latency (sec)')

ax2.legend(['Ethereum', 'Solana'])

#Latency vs Blocktime
t_axes = ax3.twinx()

ax3.plot(nodes, smallbank_eth['latency'])
ax3.plot([])

ax3.set_ylim([0, 2 + max(smallbank_eth['latency'])])

t_axes.plot([])
t_axes.plot(nodes, smallbank_eth['blocktime'])

t_axes.set_ylabel("Block Time (sec)")
t_axes.set_ylim([0, 1 + max(smallbank_eth['blocktime'])])

ax3.set_title('Transaction Latency vs BlockTime')
ax3.set_xlabel('Nodes')
ax3.set_ylabel('Latency (sec)')

ax3.legend(['Latency', 'Block Time'])

plt.show()
