class Generator {
    Next() {
        return 0;
    }

    Last() {
        return 0;
    }

    randomDouble(min  = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }
}

module.exports = {
    Generator: Generator,
}