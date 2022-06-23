class Properties {
    properties_ = {};

    GetProperty(key, default_value) {
        if (!Object.keys(this.properties_).includes(key)) {
            return default_value;
        }
        return this.properties_[key];
    }

    SetProperty(key, value) {
        this.properties_[key] = value;
    }

    Load(file_contents) {
        file_contents
            .toString()
            .split('\n')
            .filter((line) => {
                return !line.startsWith('#') && line !== '';
            })
            .map((line) => {
                const split = line.split('=');
                if (!isNaN(parseFloat(split[1]))) {
                    this.SetProperty(split[0], parseFloat(split[1]));
                } else if(!isNaN(parseInt(split[1]))) {
                    this.SetProperty(split[0], parseInt(split[1]));
                } else if (['true', 'false'].includes(split[1])){
                    this.SetProperty(split[0], split[1] === 'true');
                } else{
                    this.SetProperty(split[0], split[1]);
                }
            });
    }

    properties() {
        return this.properties_;
    }
}

module.exports = {
    Properties: Properties,
}