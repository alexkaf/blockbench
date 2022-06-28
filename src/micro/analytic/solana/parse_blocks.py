import matplotlib.pyplot as plt

file = 'dates'

block_index = []
dates = []

with open(file) as file:
    for line in file.readlines():
        line = line.strip('\n')
        dates += [int(line)]
        if not block_index:
            block_index = [0]
        else:
            block_index += [block_index[-1] + 1]

for idx, current_date in enumerate(dates):
    dates[idx] = current_date / 1000

slot_times = []
for prev_date, current_date in zip(dates, dates[1:]):
    slot_times += [current_date - prev_date]

avg_date = sum(slot_times) / len(slot_times)

plt.plot(dates, block_index, marker='o')
plt.title('Average slot time: {}'.format(avg_date))
plt.show()
