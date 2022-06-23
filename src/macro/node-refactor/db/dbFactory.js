const { SolanaDB } = require('./solana/solDB');
const { EthereumDB } = require('./ethereum/ethDB');
const { DB } = require('../core/db');

class DBFactory extends DB {

    CreateDB(props) {
        const endpoint = props.GetProperty('endpoint');
        const deploy_wait = parseInt(props.GetProperty('deploy_wait', '20'));
        const wl_name = props.GetProperty('workload', 'donothing');

        switch (props.GetProperty('dbname')) {
            case 'solana': {
                return new SolanaDB(endpoint, wl_name, deploy_wait);
            }
            case 'ethereum': {
                return new EthereumDB(endpoint, wl_name, deploy_wait);
            }
        }
    }
}

module.exports = {
    DBFactory: DBFactory,
}