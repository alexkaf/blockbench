import matplotlib.pyplot as plt 
from raw import data

nodes = [1, 2, 4, 8, 12, 14]

# KVSTORE
kvstore_eth = data['kvstore']['eth']
kvstore_sol = data['kvstore']['sol']

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(16, 5))
# fig.tight_layout()

#TPS
ax1.plot(nodes, kvstore_eth['tps'])
ax1.plot(nodes, kvstore_sol['tps'])

ax1.set_ylim([0, 20 + max(kvstore_sol['tps'])])

ax1.set_title('Transactions Per Second')
ax1.set_xlabel('Nodes')
ax1.set_ylabel('TPS')
ax1.figsize = (2, 2)
ax1.legend(['Ethereum', 'Solana'])


#Latency
ax2.plot(nodes, kvstore_eth['latency'])
ax2.plot(nodes, kvstore_sol['latency'])

ax2.set_ylim([0, 2 + max(kvstore_eth['latency'])])

ax2.set_title('Transaction Latency')
ax2.set_xlabel('Nodes')
ax2.set_ylabel('Latency (sec)')

ax2.legend(['Ethereum', 'Solana'])

#Latency vs Blocktime

t_axes = ax3.twinx()

ax3.plot(nodes, kvstore_eth['latency'], label='Latency (sec)')
ax3.plot([])

t_axes.plot([])
t_axes.plot(nodes, kvstore_eth['blocktime'], label='Block Time (sec)')

ax3.set_ylim([0, 2 + max(kvstore_eth['latency'])])

t_axes.set_ylabel("Block Time (sec)")

ax3.set_title('Transaction Latency vs BlockTime')
ax3.set_xlabel('Nodes')
ax3.set_ylabel('Latency (sec)')

ax3.legend(['Latency', 'Block Time'])

plt.show()