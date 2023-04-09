import { User } from "/backend/user/user.js";
import { CryptoWallet } from "/backend/user/wallets.js";
let user = new User()
await user.setUserData();
console.log(user)

async function loadwallets(){
    const walletsContainer = document.getElementById("wallets-container");
    for (const wallet in user.wallets){
        console.log(user.wallets[wallet].getTotalBalance())
        let boxCrypto = `
        `
        for (const crypto in user.wallets[wallet].cryptos){
            boxCrypto += `
                <h2>${crypto}: ${user.wallets[wallet].cryptos[crypto]}</h2>
            `
        }
        let boxHtml = `
            <div id="${wallet}">
                <h1>${wallet}</h1>
            </div>
            `
        boxHtml += boxCrypto
    await walletsContainer.insertAdjacentHTML('beforeend', boxHtml);
    }
}

loadwallets()