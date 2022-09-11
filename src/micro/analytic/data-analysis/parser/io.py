import matplotlib.pyplot as plt
from raw import data 

nodes = [1, 2, 4, 8, 12, 14]

kvstore_eth_ingress = data['kvstore']['eth']['ingress']
kvstore_sol_ingress = data['kvstore']['sol']['ingress']

kvstore_eth_egress = data['kvstore']['eth']['egress']
kvstore_sol_egress = data['kvstore']['sol']['egress']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 5))

kvstore_eth_ingress = list(map(lambda x: x * 1e-6, kvstore_eth_ingress))
kvstore_sol_ingress = list(map(lambda x: x * 1e-6, kvstore_sol_ingress))
ax1.plot(nodes, kvstore_eth_ingress, label='Ethereum')
ax1.plot(nodes, kvstore_sol_ingress, label='Solana')

ax1.set_xlabel('Nodes')
ax1.set_ylabel('MB')

ax1.set_title('Ingress')
ax1.set_xticks(nodes)
ax1.legend()

kvstore_eth_egress = list(map(lambda x: x * 1e-6, kvstore_eth_egress))
kvstore_sol_egress = list(map(lambda x: x * 1e-6, kvstore_sol_egress))
ax2.plot(nodes, kvstore_eth_egress, label='Ethereum')
ax2.plot(nodes, kvstore_sol_egress, label='Solana')

ax2.set_xlabel('Nodes')
ax2.set_ylabel('MB')

ax2.set_title('Egress')
ax2.set_xticks(nodes)
ax2.legend()

plt.show()