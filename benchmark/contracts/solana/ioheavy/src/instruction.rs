use borsh::BorshDeserialize;
use solana_program::{
    msg,
};
use solana_program::log::sol_log;
use solana_program::program_error::ProgramError;

#[derive(Debug)]
pub enum Instruction {
    Get([u8; 20]),
    Set([u8; 20], String),
    Write(usize, usize),
    Scan(usize, usize),
    RevertScan(usize, usize),
    Other,
}

impl Instruction {
    const USIZE_BYTES: usize = (usize::BITS / 8) as usize;

    pub fn unpack(instruction_data: &[u8]) -> Self {
        let (tag, rest) = instruction_data.split_first().unwrap();
        let mut value_20_bytes: [u8; 20] = [0; 20];


        match tag {
            0 => {
                value_20_bytes.copy_from_slice(&rest);
                Instruction::Get(value_20_bytes)
            },
            1 => {
                value_20_bytes.copy_from_slice(&rest[..20]);
                let value = String::from_utf8(rest[20..].to_vec()).unwrap();
                Instruction::Set(value_20_bytes, value)
            },
            _ => {
                let (start_key_arr, size_arr) = rest.split_at(Self::USIZE_BYTES);
                let start_key = usize::from_le_bytes(start_key_arr.try_into().unwrap());
                let size = usize::from_le_bytes(size_arr.try_into().unwrap());

                return match tag {
                    2 => {
                        Instruction::Write(start_key, size)
                    },
                    3 => {
                        Instruction::Scan(start_key, size)
                    },
                    4 => {
                        Instruction::RevertScan(start_key, size)
                    },
                    _ => Instruction::Other
                }

            }
            _ => Instruction::Other
        }
    }
}
