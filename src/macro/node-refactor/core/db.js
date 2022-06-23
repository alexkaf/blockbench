class DB {
    static kOK = 0;
    kErrorNoData = 1;
    kErrorConflict = 2;

    Scan() {};
}

module.exports = {
    DB: DB,
}