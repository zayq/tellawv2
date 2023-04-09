import { getCryptoPrice} from "/backend/api/crypto/crypto.js";


export class CryptoWallet{
    constructor(name, cryptos){
        this.name = name;
        this.cryptos = cryptos;
    }

    async getTotalBalance(){
        let totalBalance;
        for (crypto in this.cryptos){
            let price = await getCryptoPrice(crypto)
            totalBalance += price * this.cryptos[crypto];
        }
        return totalBalance
    }

}