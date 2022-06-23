use std::cell::RefCell;
use std::rc::Rc;
use std::str::FromStr;
use generator::constant::ConstGenerator;
use generator::counter::CounterGenerator;
use generator::discrete::{DiscreteGenerator, Operation, ValueDoublePair};
use generator::generator::Generator;
use generator::scrambled_zipfian::ScrambledZipfianGenerator;
use generator::skewed_latest::SkewedLatestGenerator;
use generator::uniform::UniformGenerator;
use generator::zipfian::ZipfianGenerator;
use crate::properties::Properties;
use generator::{random_print_char, fnv_hash_64};
use utils::Pair;

#[derive(Debug)]
pub enum GeneratorType {
    Constant(ConstGenerator),
    Counter(CounterGenerator),
    Uniform(UniformGenerator),
    Scrambled(ScrambledZipfianGenerator),
    Skewed(SkewedLatestGenerator),
    Zipfian(ZipfianGenerator),
    None
}

#[derive(Debug)]
pub struct Workload
{
    table_name_: Option<String>,
    field_count_: u64,
    read_all_fields_: bool,
    write_all_fields_: bool,
    field_len_generator_: GeneratorType,
    key_generator_: GeneratorType,
    op_chooser_: DiscreteGenerator<Operation>,
    key_chooser_: GeneratorType,
    field_chooser_: GeneratorType,
    scan_len_chooser_: GeneratorType,
    insert_key_sequence_: Rc<RefCell<CounterGenerator>>,
    ordered_inserts_: bool,
    record_count_: u64,
}

impl Workload {
    pub fn new() -> Self {
        Self {
            table_name_: None,
            field_count_: 0,
            read_all_fields_: false,
            write_all_fields_: false,
            field_len_generator_: GeneratorType::None,
            key_generator_: GeneratorType::None,
            op_chooser_: DiscreteGenerator::new(),
            key_chooser_: GeneratorType::None,
            field_chooser_: GeneratorType::None,
            scan_len_chooser_: GeneratorType::None,
            insert_key_sequence_: Rc::new(RefCell::new(CounterGenerator::new(3))),
            ordered_inserts_: true,
            record_count_: 0,
        }
    }

    pub fn init(&mut self, props: &Properties) {
        self.table_name_ = Some(props.get_or_default("table").to_string());
        self.field_count_ = u64::from_str(props.get_or_default("fieldcount")).unwrap();
        self.field_len_generator_ = Self::get_field_generator(props);

        let read_proportion = f64::from_str(props.get_or_default("readproportion")).unwrap();
        let update_proportion = f64::from_str(props.get_or_default("updateproportion")).unwrap();
        let insert_proportion = f64::from_str(props.get_or_default("insertproportion")).unwrap();
        let scan_proportion = f64::from_str(props.get_or_default("scanproportion")).unwrap();
        let read_modify_write_proportion = f64::from_str(props.get_or_default("readmodifywriteproportion")).unwrap();
        self.record_count_ = u64::from_str(&props["recordcount"]).unwrap();

        let request_dist = props.get_or_default("requestdistribution");
        let max_scan_len = u64::from_str(props.get_or_default("maxscanlength")).unwrap();
        let scan_len_dist = props.get_or_default("scanlengthdistribution");
        let insert_start = u64::from_str(props.get_or_default("insertstart")).unwrap();

        self.read_all_fields_ = bool::from_str(props.get_or_default("readallfields")).unwrap();
        self.write_all_fields_ = bool::from_str(props.get_or_default("writeallfields")).unwrap();

        self.ordered_inserts_ = props.get_or_default("insertorder") != "hashed";

        self.key_generator_ = GeneratorType::Counter(CounterGenerator::new(insert_start));

        if read_proportion > 0f64 {
            self.op_chooser_.add_value(Operation::Read, read_proportion);
        }

        if update_proportion > 0f64 {
            self.op_chooser_.add_value(Operation::Update, update_proportion);
        }

        if insert_proportion > 0f64 {
            self.op_chooser_.add_value(Operation::Insert, insert_proportion);
        }

        if scan_proportion > 0f64 {
            self.op_chooser_.add_value(Operation::Scan, scan_proportion);
        }

        if read_modify_write_proportion > 0f64 {
            self.op_chooser_.add_value(Operation::ReadModifyWrite, read_modify_write_proportion);
        }

        self.insert_key_sequence_.borrow_mut().set(self.record_count_);

        self.key_chooser_ = match request_dist {
            "uniform" => GeneratorType::Uniform(UniformGenerator::new(0, self.record_count_ - 1)),
            "zipfian" => {
                let op_count = u64::from_str(&props["operationcount"]).unwrap();
                let new_keys = (op_count as f64 * insert_proportion * 2f64) as u64;
                GeneratorType::Scrambled(ScrambledZipfianGenerator::new_single(self.record_count_ + new_keys))
            }
            "latest" => GeneratorType::Skewed(SkewedLatestGenerator::new(Rc::clone(&self.insert_key_sequence_))),
            _ => GeneratorType::None
        };

        self.field_chooser_ = GeneratorType::Uniform(UniformGenerator::new(0, self.field_count_ - 1));

        self.scan_len_chooser_ = match scan_len_dist {
            "uniform" => GeneratorType::Uniform(UniformGenerator::new(1, max_scan_len)),
            "zipfian" => GeneratorType::Zipfian(ZipfianGenerator::new_multiple(1, max_scan_len, ZipfianGenerator::K_ZIPFIAN_CONST)),
            _ => GeneratorType::None
        };
    }

    fn get_field_generator(props: &Properties) -> GeneratorType {
        let field_len_dist = props.get_or_default("field_len_dist");
        let field_len = u64::from_str(props.get_or_default("fieldlength")).unwrap();

        match field_len_dist {
            "constant" => {
                GeneratorType::Constant(ConstGenerator::new(field_len))
            }
            "uniform" => {
                GeneratorType::Uniform(UniformGenerator::new(1, field_len))
            }
            "zipfian" => {
                GeneratorType::Zipfian(ZipfianGenerator::new_multiple(1, field_len, ZipfianGenerator::K_ZIPFIAN_CONST))
            }
            _ => {
                GeneratorType::None
            }
        }
    }

    pub fn read_all_fields(&self) -> bool {
        self.read_all_fields_
    }

    pub fn write_all_fields(&self) -> bool {
        self.write_all_fields_
    }

    pub fn next_scan_length(&mut self) -> u64 {
        match &mut self.scan_len_chooser_ {
            GeneratorType::Uniform(uniform) => uniform.next(),
            GeneratorType::Zipfian(zipfian) => zipfian.next(),
            _ => 0
        }
    }

    pub fn next_table(&self) -> String {
        let mut result;
        if let Some(table_name) = &self.table_name_ {
            result = table_name.clone();
        }else {
            result = "".to_string();
        }
        result
    }

    pub fn build_values(&mut self, values: &mut Vec<Pair>) {
        for idx in 0..self.field_count_ {
            let value = match &mut self.field_len_generator_ {
                GeneratorType::Constant(constant) => constant.next(),
                GeneratorType::Uniform(uniform) => uniform.next(),
                GeneratorType::Zipfian(zipfian) => zipfian.next(),
                _ => 0
            };
            values.push(Pair {
                key: format!("field{}", idx).to_string(),
                value: format!("{}{}", value, random_print_char()),
            })
        }
    }

    pub fn next_sequence_key(&mut self) -> String {
        let mut key_num = 0;
        if let GeneratorType::Counter(counter) = &mut self.key_generator_ {
            key_num = counter.next();
        }
        self.build_key_name(key_num)
    }

    pub fn next_transaction_key(&mut self) -> String {
        let mut key_num;
        loop {
            key_num = match &mut self.field_len_generator_ {
                GeneratorType::Uniform(uniform) => uniform.next(),
                GeneratorType::Zipfian(zipfian) => zipfian.next(),
                _ => 0
            };
            if key_num > self.insert_key_sequence_.borrow_mut().last() {
                break;
            }
        }
        self.build_key_name(key_num)
    }

    pub fn build_key_name(&mut self, mut key_num: u64) -> String {
        if !self.ordered_inserts_ {
            key_num = fnv_hash_64(key_num);
        }
        format!("user{}", key_num)
    }

    pub fn next_field_name(&mut self) -> String {
        let mut field_name: String = "".to_string();
        if let GeneratorType::Uniform(uniform) = &mut self.field_chooser_ {
            field_name = format!("field{}",uniform.next());
        }
        field_name
    }

    pub fn next_operation(&mut self) -> Operation {
        self.op_chooser_.next()
    }

    pub fn build_update(&mut self, update: &mut Vec<Pair>) {

        let value = match &mut self.field_len_generator_ {
            GeneratorType::Constant(constant) => constant.next(),
            GeneratorType::Uniform(uniform) => uniform.next(),
            GeneratorType::Zipfian(zipfian) => zipfian.next(),
            _ => 0
        };
        update.push(Pair {
            key: self.next_field_name(),
            value: format!("{}{}", value, random_print_char()),
        });
    }
}