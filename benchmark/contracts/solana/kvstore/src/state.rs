use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::log::sol_log;

#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct Data {
    length: usize,
    content: String
}

impl Data {
    const USIZE_LEN: usize = (usize::BITS / 8) as usize;

    pub fn unpack(data: &[u8]) -> Self {
        let (length_bytes, content) = data.split_at(Self::USIZE_LEN);
        let length = usize::from_le_bytes(length_bytes.try_into().unwrap());
        match length {
            0 => {
                Self {
                    length,
                    content: String::from(""),
                }
            },
            _ => {
                Self {
                    length,
                    content: String::try_from_slice(&content[..length]).unwrap(),
                }
            }
        }

    }

    pub fn store(content: &String, dst: &mut [u8]){

        let mut serialized = Vec::new();
        content.serialize(&mut serialized);

        dst[..Self::USIZE_LEN].copy_from_slice(&serialized.len().to_le_bytes());
        dst[Self::USIZE_LEN..(Self::USIZE_LEN + serialized.len())].copy_from_slice(&serialized);
    }

    pub fn value(&self) -> String {
        self.content.clone()
    }
}