const fs = require('fs');

let stats = {};
const contents = fs.readFileSync('results')
                    .toString()
                    .split('\n')
                    .map(line => {
                        if (line === '') return;
                        const split = line.split(', ');
                        if (Object.keys(stats).includes(split[0])) {
                            stats[split[0]].content.push({
                                txId: split[2],
                                time: parseInt(split[1]),
                            })
                        } else {
                            stats[split[0]] = {
                                content: [{
                                    txId: split[2],
                                    time: parseInt(split[1]),
                                }]
                            };
                        }
                    });

let total_slots = Object.keys(stats).length;

Object.keys(stats)
    .map(key => {
        stats[key].tps = stats[key].content.length;
    })
    .map(key => {
    })

console.log(1000 / total_slots)