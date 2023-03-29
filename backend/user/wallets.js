export class CryptoWallet{
    constructor(name, cryptos){
        this.name = name;
        this.cryptos = cryptos;
    }

    logcryptos(){
        console.log(this.cryptos)
    }
}