const fs = require('fs');

const streamer = fs.open('thisfile', 'a+', () => {

});

setInterval(() => {
    console.log(streamer)
}, 1000);