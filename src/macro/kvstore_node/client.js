

class Client {
    db_;
    workload_;
    constructor(db, wl) {
        this.db_ = db;
        this.workload_ = wl;
    }

    DoInsert() {
        let key = this.workload_.NextSequenceKey();
        let pairs = this.workload_.BuildValues();
        return this.db_.
    }
}