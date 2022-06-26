import matplotlib.pyplot as plt


with open('results') as results:
    input = []
    time = []
    for line in results.readlines():
        split = line.split(', ')
        input += [split[1]]
        time += [split[-1].strip('\n')]


for idx, (current_input, current_time) in enumerate(zip(input, time)):
    input[idx] = int(current_input)
    time[idx] = int(current_time)

plt.plot(input, time)
plt.title('CPU Heavy')
plt.xlabel('Input size')
plt.ylabel('Confirmation time')
plt.xlim([input[0], input[-1]])
plt.ylim([0, max(time) + 0.1 * max(time)])
plt.show()
