use crate::constant::ConstantGenerator;
use crate::counter::CounterGenerator;
use crate::uniform::UniformGenerator;
use crate::zipfian::ZipfianGenerator;
use crate::scrambled_zipfian::ScrambledZipfianGenerator;

#[derive(Debug)]
pub enum GeneratorType {
    Constant(ConstantGenerator),
    Counter(CounterGenerator),
    Uniform(UniformGenerator),
    Zipfian(ZipfianGenerator),
    ScrambledZipfian(ScrambledZipfianGenerator),
    None
}

#[derive(Debug)]
pub struct Generator {
    pub generator: GeneratorType
}

impl Generator {
    pub fn next(&mut self) -> Result<u64, ()> {
        match &mut self.generator {
            GeneratorType::Constant(constant) => {
                Ok(constant.next())
            }
            GeneratorType::Counter(counter) => {
                Ok(counter.next())
            }
            GeneratorType::Uniform(uniform) => {
                Ok(uniform.next())
            }
            GeneratorType::Zipfian(zipfian) => {
                Ok(zipfian.next())
            }
            GeneratorType::ScrambledZipfian(scrambled_zipfian) => {
                Ok(scrambled_zipfian.next())
            }
            _ => Err(())
        }
    }

    pub fn last(&mut self) -> Result<u64, ()> {
        match &mut self.generator {
            GeneratorType::Constant(constant) => {
                Ok(constant.last())
            }
            GeneratorType::Counter(counter) => {
                Ok(counter.last())
            }
            GeneratorType::Uniform(uniform) => {
                Ok(uniform.last())
            }
            GeneratorType::Zipfian(zipfian) => {
                Ok(zipfian.last())
            }
            GeneratorType::ScrambledZipfian(scrambled_zipfian) => {
                Ok(scrambled_zipfian.last())
            }
            _ => Err(())
        }
    }
}