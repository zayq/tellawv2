import { User } from "/backend/user/user.js";
import { CryptoWallet } from "/backend/user/wallets.js";
import { getCryptoPrice, getCryptoImageUrl, getMarketCap} from "/backend/api/crypto/crypto.js";
import { Transaction } from "/backend/user/transaction.js";

let user = new User()


async function loadwallets(){
    await user.setUserData();
    let walletsContainer = document.getElementById("wallets-container");
    walletsContainer.innerHTML = '';
    for (const wallet in user.wallets){
        let walletobj = new CryptoWallet(wallet, user.wallets[wallet].cryptos)
        let boxCrypto = `
        <div class="element">
        `
        for (const crypto in user.wallets[wallet].cryptos){
            const mktcap = await getMarketCap(crypto)
            const logo = await getCryptoImageUrl(crypto);
            boxCrypto += `
            <div class="${crypto}">
                <div class="name">
                <img src="${logo}">
                ${crypto}
                </div>
                <div class="price"><i class="fa-sharp fa-solid fa-caret-up"></i><i class="fa-sharp fa-solid fa-caret-down"></i>${( await getCryptoPrice(crypto) * user.wallets[wallet].cryptos[crypto] ).toFixed(2)}</div>
                <div class="amount"> ${user.wallets[wallet].cryptos[crypto].toFixed(2)} </div>
                <div class="marketcap">${mktcap}</div>
                <div class="graph">Graphique</div>
            </div>
            `
        }

        let boxHtml = `
            <div id="${wallet}" class="walletcontent">
            <div class="wallettitle">
                <h1>${wallet}</h1>
                <div>
                <h3 id="wallettotalbalance">Current Balance: </h3>
                <span id="transacbtn" class="transacbtn">
                    <i class="fa-solid fa-plus"></i>
                    Add Transaction
                </span>
                </div>
                <h4 class="balance"> ${ await walletobj.getTotalBalance() } </h4>
            </div>

            <div class="portfolio">
                <h5>Portfolio</h5>
                <div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            
            <div class="walletelements">
                <div class="description">
                <div class="header-wallet">
                    <div class="name">Name</div>
                    <div class="price">Price</div>
                    <div class="amount">Amount</div>
                    <div class="marketcap">Marketcap</div>
                    <div class="graph">Graphique</div>
                </div>
            </div>
            `
        boxCrypto += `</div></div>
        </div>
    </div>`
        boxHtml += boxCrypto
    await walletsContainer.insertAdjacentHTML('beforeend', boxHtml);
    }
}

async function loadleftwallets(){
    const container = document.getElementById("leftwallets");
    let boxHtml = "";
    for (const wallet in user.wallets){
        boxHtml += `
         <button id="${wallet}-btn">${wallet}</button>
        `
        const wallettohide = document.getElementById(wallet)
        wallettohide.style.display = "none"

    }
    await container.insertAdjacentHTML("beforeend", boxHtml)
    const walletNames = Object.keys(user.wallets);
    const firstWalletName = walletNames[0];
    document.getElementById(firstWalletName).style.display = "flex"


    for (const wallet in user.wallets){
        const walletbtn = document.getElementById(`${wallet}-btn`);
        console.log(walletbtn.textContent)
        walletbtn.addEventListener("click", () => changewallet(walletbtn.textContent));
    }
}


await loadwallets()
await loadleftwallets()

function changewallet(walletname){
    console.log(walletname)
    for (const wallet in user.wallets){
        const wallettohide = document.getElementById(wallet)
        wallettohide.style.display = "none"
    }
    document.getElementById(walletname).style.display = "flex"
}



const transactionbtns = document.querySelectorAll(".transacbtn");
const transactionWindow = document.getElementById("transaction-window");
let isWindowOpen = false

transactionbtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    openWindow();
  });
});

function openWindow(){
    transactionWindow.style.display = "flex";
    isWindowOpen = true;
}

function closeWindow(){
    transactionWindow.style.display = "none";
    isWindowOpen = false;
}

// Detect all clicks on the document
document.addEventListener("click", function(event) {
  // If user clicks inside the element, do nothing
  if (event.target.closest("#transaction-window") || event.target.closest(".transacbtn") || event.target.closest("#transac-comeback")) return
  // If user clicks outside the element, hide it!
  else{
    if (isWindowOpen){
        closeWindow()
    }

  }

})


async function createtransaction(){
    let wallet;
    const walletContents = document.querySelectorAll('.walletcontent');
    walletContents.forEach(walletContent => {
    if (getComputedStyle(walletContent).display === 'flex') {
        wallet = walletContent.id;
    }
    });
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
    let transaction = new Transaction(symbol, ammount, type, user.id, wallet)
    await transaction.transac();
    loadwallets();
}