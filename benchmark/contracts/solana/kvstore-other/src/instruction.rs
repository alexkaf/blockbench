use std::fmt::format;
use solana_program::log::sol_log;
use borsh::{BorshDeserialize, BorshSerialize};

pub enum Instruction {
    Log(String),
    Set(SetIx),
    Get(String),
    Other,
}

#[derive(BorshDeserialize, BorshSerialize, Debug, Clone)]
pub struct SetIx {
    pub key: String,
    pub value: String,
}

impl Instruction {
    pub fn unpack(instruction_data: &[u8]) -> Self {
        let (tag, data) = instruction_data.split_first().unwrap();
        match tag {
            0 => {
                Instruction::Log(
                    String::try_from_slice(&data).unwrap(),
                )
            },
            1 => {
                Instruction::Set(
                    SetIx::try_from_slice(&data).unwrap(),
                )
            },
            2 => {
                Instruction::Get(
                    String::try_from_slice(&data).unwrap(),
                )
            }
            _ => {
                Instruction::Other
            }
        }
    }
}