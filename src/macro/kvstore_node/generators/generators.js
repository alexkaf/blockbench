module.exports = {
    ConstantGenerator: require('./constant_generator').generator,
    CounterGenerator: require('./counter_generator').generator,
    DiscreteGenerator: require('./discrete_generator').generator,
    ScrambledZipfianGenerator: require('./scrambled_zipfian_generator').generator,
    SkewedZipfianGenerator: require('./skewed_latest_generator').generator,
    UniformGenerator: require('./uniform_generator').generator,
    ZipfianGenerator: require('./zipfian_generator').generator,
}