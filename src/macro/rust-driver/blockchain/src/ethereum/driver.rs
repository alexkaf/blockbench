use crate::blockchain::BlockChain;
use web3::transports::Http;
use web3::Web3;
// use web3::Web3;

pub struct Ethereum {
    pub connection: Web3<Http>,
}

impl Ethereum {

    pub fn new() -> Self {
        let connection = Http::new("http://localhost:8545/").unwrap();
        let web3 = web3::Web3::new(connection);
        let a = web3.personal().list_accounts();
        println!("{:?}", a);
        Ethereum {
            connection: web3
        }
    }
    // pub fn new(url: &str, contract_type: &str, ) -> Self {
    // }
    //
    // fn deploy(contract: &str) {
    // }
}

impl Ethereum {
    // pub fn read(&self, key: &str) -> Result<u8, ()> {
    // }
    //
    // pub fn set(&self, key: &str, fields: &Vec<Pair>) -> Result<u8, ()> {
    // }
    //
    // pub fn almagate(&self, from: &str, to: &str) -> u8 {
    //     SmallBank::almagate(&self, from, to);
    //     1
    // }
    //
    // pub fn get_balance(&self, account: &str) -> u8 {
    //     SmallBank::get_balance(&self, account);
    //     1
    // }
    //
    // pub fn update_balance(&self, account: &str, amount: usize) -> u8 {
    //     SmallBank::update_balance(&self, account, amount);
    //     1
    // }
    //
    // pub fn update_saving(&self, account: &str, amount: usize) -> u8 {
    //     SmallBank::update_saving(&self, account, amount);
    //     1
    // }
    //
    // pub fn send_payment(&self, from: &str, to: &str, amount: usize) -> u8 {
    //     SmallBank::send_payment(&self, from, to, amount);
    //     1
    // }
    //
    // pub fn write_check(&self, from: &str, amount: usize) -> u8 {
    //     SmallBank::write_check(&self, from, amount);
    //     1
    // }

}

// impl BlockChain for Ethereum {
//     type Object = Solana;
//
//     fn get_tip(&self) -> u64 {
//         self.connection.get_block_height_with_commitment(CommitmentConfig::confirmed()).unwrap()
//     }
//
//     fn poll_transaction_by_block(&self, block_number: u64) -> Option<Vec<EncodedTransactionWithStatusMeta>>{
//         None
//     }
// }
