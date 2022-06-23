const log = require('./instructions/log');
const set = require('./instructions/set');
const get = require("./instructions/get");

module.exports = {
    log: log.log,
    set: set.set,
    get: get.get,
};