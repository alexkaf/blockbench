use borsh::BorshDeserialize;
use solana_program::{
    msg,
};
use solana_program::log::sol_log;
use solana_program::program_error::ProgramError;

#[derive(Debug)]
pub enum Instruction {
    Get(Vec<u8>),
    Set(Vec<u8>, Vec<u8>),
    Other,
}

#[derive(Debug, BorshDeserialize)]
pub struct SetIx {
    key: Vec<u8>,
    value: Vec<u8>,
}

impl Instruction {
    pub fn new(instruction_data: &[u8]) -> Instruction {
        let (tag, rest) = instruction_data.split_first().unwrap();

        match tag {
            0 => {
                Instruction::Get(rest.to_vec())
            },
            1 => {
                let ix = SetIx::try_from_slice(&rest).unwrap();
                Instruction::Set(ix.key, ix.value)
            },
            _ => {
                Instruction::Other
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::instruction::Instruction;

    #[test]
    fn tag_0() {
        let instruction_data = [0, 1, 2, 3, 4, 5];
        let res = Instruction::new(&instruction_data);
        println!("{:?}", res);
    }

    #[test]
    fn tag_1() {
        let instruction_data = [1, 1, 2, 3, 4, 5];
        let res = Instruction::new(&instruction_data);
        println!("{:?}", res);
    }
}