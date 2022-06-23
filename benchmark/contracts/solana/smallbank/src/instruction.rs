use std::fmt::format;
use bigint::U256;
use borsh::{BorshDeserialize, BorshSerialize};
use crate::instruction::Instruction::Almagate;

#[derive(Debug)]
pub enum Instruction {
    Almagate(String, String),
    GetBalance(String),
    UpdateBalance(String, U256),
    UpdateSaving(String, U256),
    SendPayment(String, String, U256),
    WriteCheck(String, U256),
    Other,
}

#[derive(BorshDeserialize)]
pub struct AlmagateIx {
    arg0: String,
    arg1: String,
}

#[derive(BorshDeserialize)]
pub struct GetBalanceIx {
    arg0: String,
}

#[derive(BorshDeserialize)]
pub struct UpdateBalanceIx {
    arg0: String,
    arg1: [u8; 32],
}

#[derive(BorshDeserialize)]
pub struct SendPaymentIx {
    arg0: String,
    arg1: String,
    arg2: [u8; 32],
}

#[derive(BorshDeserialize)]
pub struct WriteCheckIx {
    arg0: String,
    arg1: [u8; 32],
}

impl Instruction {
    pub fn unpack(instruction_data: &[u8]) -> Self {
        let (tag, rest) = instruction_data.split_first().unwrap();

        match tag {
            0 => {
                let unfolded = AlmagateIx::try_from_slice(&rest).unwrap();
                Instruction::Almagate(
                    unfolded.arg0,
                    unfolded.arg1
                )
            }
            1 => {
                let unfolded = GetBalanceIx::try_from_slice(&rest).unwrap();
                Instruction::GetBalance(
                    unfolded.arg0,
                )
            }
            2 => {
                let unfolded = UpdateBalanceIx::try_from_slice(&rest).unwrap();
                Instruction::UpdateBalance(
                    unfolded.arg0,
                    U256::from_little_endian(&unfolded.arg1),
                )
            }
            3 => {
                let unfolded = UpdateBalanceIx::try_from_slice(&rest).unwrap();
                Instruction::UpdateSaving(
                    unfolded.arg0,
                    U256::from_little_endian(&unfolded.arg1),
                )
            }
            4 => {
                let unfolded = SendPaymentIx::try_from_slice(&rest).unwrap();
                Instruction::SendPayment(
                    unfolded.arg0,
                    unfolded.arg1,
                    U256::from_little_endian(&unfolded.arg2),
                )
            }
            5 => {
                let unfolded = WriteCheckIx::try_from_slice(&rest).unwrap();
                Instruction::WriteCheck(
                    unfolded.arg0,
                    U256::from_little_endian(&unfolded.arg1),
                )
            }
            _ => {
                Instruction::Other
            }
        }
    }
}