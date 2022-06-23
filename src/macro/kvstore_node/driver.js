const { parseCommandLine, } = require('../node-refactor/parseCommandLine');
const { Properties } = require("./properties");
const {Workload} = require("./workload/workload");

let p = new Properties();
const parsed = parseCommandLine(p);
const filename = parsed.filename;
p = parsed.properties;

let wl = new Workload();
wl.Init(p)

console.log(wl)
