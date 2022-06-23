const fs = require('fs');

class Statistic {

    stats_path_;
    checkpoint_interval_;
    os_;
    constructor(stat_path, checkpoint_interval) {
        this.stats_path_ = stat_path;
        this.checkpoint_interval_ = checkpoint_interval;
        this.os_ = fs.readFileSync(stat_path);
    }

    GetInterval() {
        return this.checkpoint_interval_;
    }

    GetInstance(stat_path, checkpoint_interval) {
        return new Statistic(stat_path, checkpoint_interval);
    }

    Send(message) {
        fs.appendFileSync(this.stats_path_, `${message}\n`)
    }
}

module.exports = {
    Statistic: Statistic,
}