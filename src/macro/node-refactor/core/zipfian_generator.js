const { Generator } = require('./generator');
const utils = require('./utils');
const assert = require('assert');

const kZipfianConst = 0.99;
const kMaxNumItems = Math.pow(2, 40);

class ZipfianGenerator extends Generator {
    kZipfianConst = 0.99;
    kMaxNumItems = kMaxNumItems;

    num_items_;
    base_;
    theta_;
    zeta_n_;
    eta_;
    alpha_;
    zeta_2_;
    n_for_zeta_;
    last_value_;

    constructor(min_or_num_items, max, zipfian_const = kZipfianConst) {
        super();
        if (arguments.length === 1) {
            this.#ZipfianGeneratorSingle(min_or_num_items);
        } else {
            this.#ZipfianGeneratorMulti(min_or_num_items, max, zipfian_const);
        }
    }

    #ZipfianGeneratorSingle(num_items) {
        this.#ZipfianGeneratorMulti(0, num_items - 1, this.kZipfianConst)
    }

    #ZipfianGeneratorMulti(min, max, zipfian_const) {
        this.num_items_ = max - min + 1;
        this.base_ = min;
        this.theta_ = zipfian_const;
        this.zeta_n_ = 0;
        this.n_for_zeta_ = 0;

        assert(this.num_items_ >= 2 && this.num_items_ < this.kMaxNumItems);

        this.zeta_2_ = this.#Zeta(2, this.theta_);
        this.alpha_ = 1.0 / (1.0 / this.theta_);
        this.#RaiseZeta(this.num_items_);
        this.eta_ = this.#Eta();

        this.Next();
    }

    #Zeta(num_or_last_num, theta_or_cur_num, theta, last_zeta) {
        if (arguments.length === 2) {
            return this.#ZetaDouble(num_or_last_num, theta_or_cur_num);
        } else {
            return this.#ZetaMulti(num_or_last_num, theta_or_cur_num, theta, last_zeta);
        }
    }

    #ZetaDouble(num, theta) {
        return this.#ZetaMulti(0, num, theta, 0);
    }

    #ZetaMulti(last_num, cur_num, theta, last_zeta) {
        let zeta = last_zeta;
        for (let i = last_num + 1; i <= cur_num; i += 1){
            zeta += 1 / Math.pow(i, theta);
        }
        return zeta;
    }

    #RaiseZeta(num) {
        assert(num >= this.n_for_zeta_);
        this.zeta_n_ = this.#Zeta(this.n_for_zeta_, num, this.theta_, this.zeta_n_);
        this.n_for_zeta_ = num;
    }

    #Eta() {
        return (1 - Math.pow(2.0 / this.num_items_, 1 - this.theta_)) /
            (1 - this.zeta_2_ / this.zeta_n_);
    }

    #Next(num) {
        assert(num >= 2 && num < kMaxNumItems);

        if (num > this.n_for_zeta_) {
            this.#RaiseZeta(num);
            this.eta_ = this.#Eta();
        }

        const u = utils.RandomDouble();
        const uz = u * this.zeta_n_;

        if (uz < 1.0) {
            this.last_value_ = 0;
            return this.last_value_;
        }

        if (uz < 1.0 + Math.pow(0.5, this.theta_)) {
            this.last_value_ = 1;
            return this.last_value_;
        }

        this.last_value_ =
            this.base_ + num * Math.pow(this.eta_ * u - this.eta_ + 1, this.alpha_);
        return this.last_value_;
    }

    Next() {
        return this.#Next(this.num_items_);
    }

    Last() {
        return this.last_value_;
    }
}

module.exports = {
    ZipfianGenerator: ZipfianGenerator,
    kZipfianConst: kZipfianConst,
}