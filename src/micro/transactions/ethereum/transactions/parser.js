
const parse = () => {
    const arguments = process.argv.slice(2);
    let parsedArguments = {};

    while (true) {
        let flag = arguments.shift();
        
        if (flag === undefined) return parsedArguments;

        switch (flag) {
            case "-k": {
                parsedArguments["keypairs"] = parseInt(arguments.shift());
                break;
            }
            case "-t": {
                arguments.shift();
                break;
            }
            case "-e": {
                if (parsedArguments["endpoint"] === undefined) {
                    parsedArguments["endpoint"] = [arguments.shift()];
                } else {
                    parsedArguments["endpoint"].push(arguments.shift());
                }
                break;
            }
            case "-txs": {
                parsedArguments["txs"] = parseInt(arguments.shift());
                break;
            }
            case "-r": {
                parsedArguments["rate"] = parseInt(arguments.shift());                
                break;
            }
        }
    }
}

module.exports = {
    parser: parse,
}