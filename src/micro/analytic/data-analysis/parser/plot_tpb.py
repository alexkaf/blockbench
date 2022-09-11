import matplotlib.pyplot as plt
from raw import data

donothing = data['donothing']['eth']['tpb']
kvstore = data['kvstore']['eth']['tpb']
smallbank = data['smallbank']['eth']['tpb']

fig, ax = plt.subplots()

ax.plot(donothing, label='DoNothing')
ax.plot(kvstore, label='KvStore')
ax.plot(smallbank, label='SmallBank')

ax.set_xlabel('Nopes')
ax.set_ylabel('Transactions Per Block')

ax.legend()


plt.show()