use std::env;
use std::collections::HashMap;
use std::ops::Index;
use std::fs;
use std::result::{
    Result,
};

#[derive(Debug)]
enum PropertiesError {
    MissingFlagValue,
    InvalidFlag,
}

#[derive(Debug)]
pub struct Properties {
    pub properties_: HashMap<String, String>,
    defaults: HashMap<String, String>,
}

impl Index<&str> for Properties {
    type Output = String;

    fn index(&self, index: &str) -> &Self::Output {
        &self.properties_.get(index).unwrap()
    }
}

impl Properties {
    pub fn new() -> Self {
        let mut default_map = HashMap::<String, String>::new();
        Self::set_defaults(&mut default_map);
        Properties{
            properties_: HashMap::<String, String>::new(),
            defaults: default_map,
        }
    }

    fn set_defaults(hashmap: &mut HashMap<String, String>) {
        hashmap.insert("table".to_string(), "usertable".to_string());
        hashmap.insert("fieldcount".to_string(), "10".to_string());
        hashmap.insert("field_len_dist".to_string(), "constant".to_string());
        hashmap.insert("fieldlength".to_string(), "100".to_string());
        hashmap.insert("readallfields".to_string(), "true".to_string());
        hashmap.insert("writeallfields".to_string(), "false".to_string());
        hashmap.insert("readproportion".to_string(), "0.95".to_string());
        hashmap.insert("updateproportion".to_string(), "0.05".to_string());
        hashmap.insert("insertproportion".to_string(), "0.0".to_string());
        hashmap.insert("scanproportion".to_string(), "0.0".to_string());
        hashmap.insert("readmodifywriteproportion".to_string(), "0.0".to_string());
        hashmap.insert("requestdistribution".to_string(), "uniform".to_string());
        hashmap.insert("maxscanlength".to_string(), "1000".to_string());
        hashmap.insert("scanlengthdistribution".to_string(), "uniform".to_string());
        hashmap.insert("insertorder".to_string(), "hashed".to_string());
        hashmap.insert("insertstart".to_string(), "0".to_string());
    }

    pub fn parse_command_line_arguments() -> Self {
        let mut properties_object = Properties::new();
        let mut arguments = env::args();
        arguments.next();

        loop {
            match arguments.next() {
                Some(flag) => {
                    Self::insert_to_properties(&mut properties_object, flag.as_str(), arguments.next()).unwrap();
                },
                None => {
                    break;
                }
            }
        }

        properties_object
    }

    fn insert_to_properties(&mut self, flag: &str, value: Option<String>) -> Result<(), PropertiesError>{

        let user_value = match value {
            Some(user_value) => user_value,
            None => { return Err(PropertiesError::MissingFlagValue); }
        };

        match flag {
            "-threads" => {
                Self::set_property(self, "threadcount", &user_value);
            },
            "-db" => {
                Self::set_property(self, "dbname", &user_value);
            },
            "-endpoint" => {
                Self::set_property(self, "endpoint", &user_value);
            },
            "-txrate" => {
                Self::set_property(self, "txrate", &user_value);
            },
            "-wl" => {
                Self::set_property(self, "workload", &user_value);
            }
            "-wt" => {
                Self::set_property(self, "deploy_wait", &user_value);
            }
            "-P" => {
                Self::load_arguments_from_file(self, &user_value);
            }
            "-ops" => {
                Self::set_property(self, "recordcount", &user_value);
            }
            _ => {
                return Err(PropertiesError::InvalidFlag)
            }
        }
        Ok(())
    }

    pub fn get_property<'a>(&'a self, key: &str, default: &'a str) -> &'a str {
        if self.properties_.contains_key(key) {
            self.properties_.get(&key.to_string()).unwrap()
        } else {
            default
        }
    }

    pub fn get_or_default(&self, key: &str) -> &str {
        if self.properties_.contains_key(key) {
            &self.properties_.get(key).unwrap()
        } else {
            &self.defaults.get(key).unwrap()
        }
    }

    pub fn set_property(&mut self, key: &str, value: &str) {
        self.properties_.insert(String::from(key), String::from(value));
    }

    fn load_arguments_from_file(props: &mut Properties, file: &str) {
        let contents = fs::read_to_string(file).unwrap();

        let split = contents.split("\n");

        for line in split {
            if line.starts_with("#") || line.is_empty() {
                continue
            } else {
                let split_line = line.split("=");

                assert_eq!(split_line.count(), 2);

                let mut split_line = line.split("=");

                let key = match split_line.next() {
                    Some(key) => key,
                    None => { "" }
                };

                let value = match split_line.next() {
                    Some(value) => value,
                    None => { "" }
                };

                Self::set_property(props, key, value);
            }
        }
    }
}