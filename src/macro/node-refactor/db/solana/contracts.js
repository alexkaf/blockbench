module.exports = {
    do_nothing: require('./donothing/doNothingIx').do_nothing,
    get_ix: require('./kvstore/getIx').get,
    set_ix: require('./kvstore/setIx').set,
}