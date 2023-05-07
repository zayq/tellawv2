import { getCryptoPrice} from "/backend/api/crypto/crypto.js";
import { getCurrencyPrice } from "/backend/api/currency/currency.js";

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
        return totalBalance.toFixed(2)
    }

}

export class CurrencyWallet{
    constructor(name, currencies) {
        this.name = name
        this.currencies = currencies
    }

    async getTotalBalance(){
        let totalBalance = 0;
        for (let currency in this.currencies){
            let price = await getCurrencyPrice(currency);
            totalBalance += price * this.currencies[currency]
            console.log("CURRENCY WALLLRE" + price + this.currencies[currency])
        }
        return totalBalance.toFixed(2)
    }
}