const fs = require('fs');

const parseCommandLine = (properties) => {
    let arguments = process.argv.slice(2);
    let key, value, filename;
    while (arguments.length !== 0) {
        key = arguments.shift();
        value = arguments.shift();

        if (!key.startsWith('-')) {
            throw `Invalid key ${key}`;
        }

        switch (key) {
            case '-threads': {
                properties.SetProperty('threadcount', parseInt(value));
                break;
            }
            case '-db': {
                properties.SetProperty('dbname', value);
                break;
            }
            case '-endpoint': {
                properties.SetProperty('endpoint', value);
                break;
            }
            case '-txrate': {
                properties.SetProperty('txrate', parseInt(value));
                break;
            }
            case '-wt': {
                properties.SetProperty('deploy_wait', parseInt(value));
                break;
            }
            case '-wl': {
                properties.SetProperty('workload', value);
                break;
            }
            case '-P': {
                const fileContents = fs.readFileSync(value);
                properties.Load(fileContents);
                filename = value;
                break;
            }
            default: {
                throw `Invalid argument ${key}`;
            }
        }
    }
    return filename;
}

module.exports = {
    parseCommandLine: parseCommandLine,
}