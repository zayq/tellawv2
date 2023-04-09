import { getCryptoPrice} from "/backend/api/crypto/crypto.js";


export class CryptoWallet{
    constructor(name, cryptos){
        this.name = name;
        this.cryptos = cryptos;
        this.totalBalance = 0;
    }

    async getTotalBalance(){
        let totalBalance = 0;
        for (let crypto in this.cryptos){
            let price = await getCryptoPrice(crypto)
            totalBalance += price * this.cryptos[crypto];
        }
        return totalBalance
    }

}