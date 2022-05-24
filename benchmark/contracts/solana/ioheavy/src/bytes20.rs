use bigint::U256;
use std::ops::BitOr;
use hex;

#[derive(Debug)]
pub struct Bytes20 {
    pub value: [u8; 20],
}

#[derive(Debug)]
pub enum Bytes20Error {
    LongerThan20,
    TooLargeNumber,
}

impl Bytes20 {

    pub fn empty() -> Self {
        Bytes20 {
            value: [0; 20],
        }
    }

    pub fn zeros_in_string() -> Self {
        Bytes20 {
            value: [48; 20],
        }
    }

    pub fn from_str(src: &str) -> Result<Self, Bytes20Error> {
        if src.len() > 20 {
            return Err(Bytes20Error::LongerThan20);
        }

        let mut buffer: [u8; 20] = [0; 20];
        let to_bytes = src.as_bytes();
        buffer[..src.len()].copy_from_slice(&to_bytes);
        Ok(Bytes20 {
            value: buffer,
        })
    }

    pub fn to_u256(&self) -> Result<U256, Bytes20Error> {
        Ok(U256::from_big_endian(&self.value))
    }

    pub fn from_u256(num256: &U256) -> Result<Bytes20, Bytes20Error> {
        let max_bytes_20_value = U256::from_big_endian(&[255; 20]);
        if num256.gt(&max_bytes_20_value) {
            return Err(Bytes20Error::TooLargeNumber);
        }

        let mut empty: [u8; 32] = [0; 32];
        let mut buffer: [u8; 20] = [0; 20];

        num256.to_big_endian(&mut empty);
        buffer.copy_from_slice(&empty[12..]);
        Ok(Bytes20 {
            value: buffer,
        })
    }

    pub fn bitor(&self, other: &Bytes20) -> Self {
        let after_bitor = &self.value.iter()
            .zip(other.value.iter())
            .map(|(elem_1, elem_2)| elem_1.bitor(elem_2))
            .collect::<Vec<u8>>()[..];
        let mut buffer: [u8; 20] = [0; 20];
        buffer.copy_from_slice(&after_bitor[..]);


        Bytes20 {
            value: buffer,
        }
    }

    pub fn as_str(&self) -> String {
        format!("0x{}", hex::encode(self.value))
    }
}

trait Bytes20ForU256 {
    fn to_bytes20(&self) -> Result<Bytes20, Bytes20Error>;

    fn from_bytes20(bytes20: &Bytes20) -> Self;
}

impl Bytes20ForU256 for U256 {
    fn to_bytes20(&self) -> Result<Bytes20, Bytes20Error> {
        let max_bytes_20_value = U256::from_big_endian(&[255; 20]);
        if self.gt(&max_bytes_20_value) {
            return Err(Bytes20Error::TooLargeNumber);
        }

        let mut empty: [u8; 32] = [0; 32];
        let mut buffer: [u8; 20] = [0; 20];

        self.to_big_endian(&mut empty);
        buffer.copy_from_slice(&empty[12..]);
        Ok(Bytes20 {
            value: buffer,
        })
    }

    fn from_bytes20(bytes20: &Bytes20) -> Self {
        U256::from_big_endian(&bytes20.value)
    }
}
