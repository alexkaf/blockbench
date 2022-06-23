use crate::get_random_double;
use crate::generator::Generator;

#[derive(Debug)]
pub struct ZipfianGenerator {
    num_items_: u64,
    base_: u64,
    n_for_zeta_: u64,
    last_value_: u64,
    theta_: f64,
    zeta_n_: f64,
    eta_: f64,
    alpha_: f64,
    zeta_2_: f64,
}

impl ZipfianGenerator {
    pub const K_ZIPFIAN_CONST: f64 = 0.99;
    const  K_MAX_NUM_ITEMS: u64 = (u64::MAX >> 24);

    pub fn new_single(num_items: u64) -> Self {
        ZipfianGenerator::new_multiple(0, num_items - 1, ZipfianGenerator::K_ZIPFIAN_CONST)
    }

    pub fn new_multiple(min: u64, max: u64, zipfian_const: f64) -> Self {
        let num_items_ = max - min + 1;
        let base_ = min;
        let theta_ = zipfian_const;
        let zeta_n_ = 0f64;
        let n_for_zeta_ = 0;

        assert!(num_items_ >= 2 && num_items_ < ZipfianGenerator::K_MAX_NUM_ITEMS);
        let zeta_2_ = ZipfianGenerator::zeta_double(2, theta_);
        let alpha_ = 1f64 / (1f64 - theta_);

        let mut obj = Self {
            num_items_,
            base_,
            n_for_zeta_,
            last_value_: 0,
            theta_,
            zeta_n_,
            eta_: 0f64,
            alpha_,
            zeta_2_,
        };

        obj.raise_zeta(num_items_);

        obj.eta_ = obj.eta();
        obj.next_zero_args();
        obj
    }

    fn raise_zeta(&mut self, num: u64) {
        assert!(num >= self.n_for_zeta_);
        self.zeta_n_ = ZipfianGenerator::zeta_multiple(self.n_for_zeta_, num, self.theta_, self.zeta_n_);
        self.n_for_zeta_ = num;
    }

    fn eta(&self) -> f64{
        (1.0 - f64::powf(2.0 / self.num_items_ as f64, 1.0 - self.theta_))
            / (1.0 - self.zeta_2_ / self.zeta_n_)
    }

    pub fn next_zero_args(&mut self) -> u64 {
        self.next_single_arg(self.num_items_)
    }

    pub fn next_single_arg(&mut self, num: u64) -> u64 {
        assert!(num >= 2 && num < ZipfianGenerator::K_MAX_NUM_ITEMS);
        if num > self.n_for_zeta_ {
            self.raise_zeta(num);
            self.eta_ = self.eta();
        }

        let u = get_random_double();
        let uz = u * self.zeta_n_;

        if uz < 1.0 {
            self.last_value_ = 0;
            return self.last_value_;
        }

        if uz < 1.0 + f64::powf(0.5, self.theta_) {
            self.last_value_ = 1;
            return self.last_value_;
        }

        self.last_value_ = (self.base_ as f64 + num as f64 * f64::powf(self.eta_ * (u - 1.0), self.alpha_)) as u64;
        self.last_value_
    }

    pub fn last(&self) -> u64 {
        self.last_value_
    }

    fn zeta_double(num: u64, theta: f64) -> f64 {
        ZipfianGenerator::zeta_multiple(0, num, theta, 0f64)
    }

    fn zeta_multiple(last_num: u64, cur_num: u64, theta: f64, last_zeta: f64) -> f64 {
        let mut zeta = last_zeta;
        for i in (last_num + 1)..(cur_num + 1) {
            zeta += 1f64 / f64::powf(i as f64, theta);
        }
        zeta
    }
}

impl Generator for ZipfianGenerator {
    type Object = u64;

    fn next(&mut self) -> Self::Object {
        self.next_zero_args()
    }

    fn last(&mut self) -> Self::Object {
        self.last_value_
    }
}