import { User } from "/backend/user/user.js";
import { CryptoWallet } from "/backend/user/wallets.js";
import { getCryptoPrice} from "/backend/api/crypto/crypto.js";
import { Transaction } from "/backend/user/transaction.js";

let user = new User()
console.log(user)

async function loadwallets(){
    await user.setUserData();
    let walletsContainer = document.getElementById("wallets-container");
    walletsContainer.innerHTML = '';
    for (const wallet in user.wallets){
        let walletobj = new CryptoWallet(wallet, user.wallets[wallet].cryptos)
        console.log(walletobj.getTotalBalance())
        let boxCrypto = `
        `
        for (const crypto in user.wallets[wallet].cryptos){
            boxCrypto += `
                <h2>${crypto} : ${user.wallets[wallet].cryptos[crypto]} : ${( await getCryptoPrice(crypto) * user.wallets[wallet].cryptos[crypto] ).toFixed(2)}$</h2>
            `
        }
        let boxHtml = `
            <div id="${wallet}">
                <h1>${wallet}</h1>
                <h2>TOTAL :  ${ await walletobj.getTotalBalance() }$</h2>
            </div>
            `
        boxHtml += boxCrypto
    await walletsContainer.insertAdjacentHTML('beforeend', boxHtml);
    }
}

loadwallets()

const transactionbtn = document.getElementById("create-transaction")
const closetransaction = document.getElementById("close-transaction-window")
transactionbtn.addEventListener("click", function(){
    tooglewindowtransaction("flex")
})
closetransaction.addEventListener("click", function(){
    tooglewindowtransaction("none")
})
function tooglewindowtransaction(display){
    document.getElementById("create-transaction-window").style.display = display;
}

const createtransactionbtn = document.getElementById("submit-transaction")

createtransactionbtn.addEventListener("click", createtransaction)

async function createtransaction(){
    const symbol = document.getElementById("tsymbol").value;
    const ammount = document.getElementById("tammount").value;
    const buy = document.getElementById("buy").checked
    const sell = document.getElementById("sell").checked
    let type;

    if ( buy == true){
        type = true
    }
    if( sell == true){
        type = false
    }
    let transaction = new Transaction(symbol, ammount, type, user.id, "Binance")
    await transaction.transac();
    loadwallets();
}