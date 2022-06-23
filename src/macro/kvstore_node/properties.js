const fs = require("fs");

class Properties {

    properties_ = {
        table: 'usertable',
        fieldcount: 10,
        field_len_dist: 'constant',
        fieldlength: 100,
        readallfields: true,
        writeallfields: false,
        readproportion: 0.95,
        updateproportion: 0.05,
        insertproportion: 0.0,
        scanproportion: 0.0,
        readmodifywriteproportion: 0.0,
        requestdistribution: 'uniform',
        maxscanlength: 1000,
        scanlengthdistribution: 'uniform',
        insertorder: 'hashed',
        insertstart: 0,
        recordcount: 'operationcount',
    };

    GetProperty(key , default_value) {
        console.log(key)
        if (Object.keys(this.properties_).includes(key)) {
            return this.properties_[key];
        }else {
            return default_value;
        }
    }

    SetProperty(key, value) {
        this.properties_[key] = value;
    }

    Load(filename) {
        const contents = fs.readFileSync(filename).toString('utf8');
        const res = contents
            .split('\n')
            .map((line) => {
                return line.trim();
            })
            .filter((line) => {
                return (!line.startsWith('#') && (line.length !== 0))
            })
            .map((line) => {
                const split_line = line.split('=');

                switch (split_line[1]) {
                    case 'true': {
                        this.properties_[split_line[0]] = true;
                        break;
                    }
                    case 'false': {
                        this.properties_[split_line[0]] = false;
                        break;
                    }
                    default: {
                        this.properties_[split_line[0]] = parseFloat(split_line[1]);

                        if (isNaN(this.properties_[split_line[0]])){
                            this.properties_[split_line[0]] = split_line[1];
                        }
                        break;
                    }
                }


            });
    }
}

module.exports = {
    Properties: Properties,
}