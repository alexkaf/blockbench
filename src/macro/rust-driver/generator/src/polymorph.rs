#![allow(unused)]

pub trait Init0 {
    type Object;

    fn new() -> Self::Object;
}

pub trait Init1 <T> {
    type Object;

    fn new(value: T) -> Self::Object;
}

pub trait Init2 <T, U> {
    type Object;

    fn new(value_1: T, value_2: U) -> Self::Object;
}

pub trait Init3 <T, U, Y> {
    type Object;

    fn new(value_1: T, value_2: U, value_3: Y) -> Self::Object;
}

pub trait Init4 <T, U, Y, X> {
    type Object;

    fn new(value_1: T, value_2: U, value_3: Y, value_4: X) -> Self::Object;
}