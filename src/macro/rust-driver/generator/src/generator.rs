pub trait GeneratorOps<T> {
    fn next(&mut self) -> T;

    fn last(&mut self) -> T;
}

pub trait Generator {
    type Object;
    fn next(&mut self) -> Self::Object;

    fn last(&mut self) -> Self::Object;
}