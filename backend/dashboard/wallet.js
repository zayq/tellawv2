import { User } from "/backend/user/user.js";
import { CryptoWallet } from "/backend/user/wallets.js";
import { getCryptoPrice, getCryptoImageUrl, getMarketCap} from "/backend/api/crypto/crypto.js";
import { Transaction } from "/backend/user/transaction.js";
import { data } from "/backend/database/crypto_list.js";
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
                <div class="price"><i class="fa-sharp fa-solid fa-caret-up"></i><i class="fa-sharp fa-solid fa-caret-down"></i>${await getCryptoPrice(crypto)}</div>
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
      //<div id="${wallet}-btn">${wallet}</div>
        boxHtml += `
         <div id="${wallet}-btn" class="w">
         <div class="logoimg">img</div>
         <div>
         <p>${wallet}</p>
         <p>2</p>
         </div>
         </div>
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
        walletbtn.addEventListener("click", () => changewallet(walletbtn.querySelector("p").textContent));
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



function createwindowselect(){
    let windowselect = document.getElementById("transaction-window")
  
    windowselect.innerHTML = `
      <div id="header">
        <h1 id="select">Select a coin</h1>
      </div>
      <div id="dropdown-content">
        <input type="text" id="search-bar" placeholder="Search">
        <ul id="search-results"></ul>
      </div>
    `
  
    const searchBar = document.getElementById('search-bar');
    const searchResults = document.getElementById('search-results');
    search()
    function search() {
      if (!data) {
        setTimeout(search, 100);
        return;
      }
  
    const query = searchBar.value.toLowerCase();
    const matches = Object.entries(data).filter(([symbol, name]) => name.toLowerCase().includes(query));
    const limitedMatches = matches.slice(0, 10); // limit the matches to the first 10
  
    searchResults.innerHTML = '';
  
    if (limitedMatches.length > 0) {
      limitedMatches.forEach(async ([symbol, name]) => {
        const li = document.createElement('li');
        li.innerHTML += `
        <img id="selectimage" src="${await getCryptoImageUrl(symbol)}">
        <span>${name}</span>
        <span class="symbolspan">${symbol}</span>
        `
        li.addEventListener('click', function() {
          const selectedCoin = symbol;
          console.log(selectedCoin);
  
          createwindowtransac(selectedCoin);
        });
        searchResults.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'No matches found.';
      searchResults.appendChild(li);
    }
  }
  
  searchBar.addEventListener('input', search);
  }
  
  createwindowselect()
  
  async function createwindowtransac(selectedCoin){
    let transactionwindow = document.getElementById("transaction-window")
    transactionwindow.innerHTML = `
          <div id="header">
              <i id="transac-comeback" class="fa-solid fa-arrow-left"></i>
              <h1 id="select">Add Transaction</h1>
          </div>
          <div id="options">
              <button class="option-transac" id="Buy">Buy</button>
              <button class="option-transac" id="Sell">Sell</button>
          </div>
          <div id="coinselected">
            <img id="selectedcoinlogo" src="${await getCryptoImageUrl(selectedCoin)}">
            <h1 id="selectedcoin">${data[selectedCoin]}</h1>
            <h2 id="symbolselected" class="symbolspanselected">${selectedCoin.toUpperCase()}</h2>
          </div>
          <div id="inputs">
              <div class="input">
                  <h3>Quantity</h3>
                  <input class="inputin" id="quantity-input" type="number">
              </div>
              <div class="input">
                  <h3>Price Per Coin (Beta)</h3>
                  <input id="pricepercoin" class="inputin" type="number">
              </div>
          </div>
  
          <div id="Total">
              <h3 id="totalspent">Total Spent</h3>
              <h2 id="totalspentammount">$ 0</h2>
          </div>
          <div id="createtransaction">
            <button id="createtransaction-btn">Add Transaction</button>
          </div>
    `
  
    const comeback = document.getElementById("transac-comeback")
  
    comeback.addEventListener("click", function(){
      createwindowselect()
    })
  
    const pricepercoin = document.getElementById("pricepercoin")
  
    pricepercoin.value = await getCryptoPrice(selectedCoin);
  
    const quantityInput = document.getElementById("quantity-input");
  
    quantityInput.value = "0"
    const totalSpentAmount = document.getElementById("totalspentammount");
    const price = await getCryptoPrice(selectedCoin)
    const updateTotalSpent = function() {
      const quantity = parseFloat(quantityInput.value) || 0;
      totalSpentAmount.innerHTML = `$ ${(quantity * price).toFixed(2)}`;
     
    };
    quantityInput.addEventListener("input", updateTotalSpent);
    quantityInput.addEventListener("blur", function() {
      if (quantityInput.value === "") {
        quantityInput.value = "0";
        updateTotalSpent();
      }
    });
  
    const buy = document.getElementById("Buy");
    const sell = document.getElementById("Sell");
    buy.classList.add("active");
  
    buy.addEventListener("click", function() {
      buy.classList.add("active");
      sell.classList.remove("active")
    })
    sell.addEventListener("click", function() {
      sell.classList.add("active");
      buy.classList.remove("active")
    })
    const addtransactionbtn = document.getElementById("createtransaction-btn")
  
    addtransactionbtn.addEventListener("click", createtransaction)
  }
  
  
  async function createtransaction(){
    let wallet;
    const walletContents = document.querySelectorAll('.walletcontent');
    walletContents.forEach(walletContent => {
    if (getComputedStyle(walletContent).display === 'flex') {
        wallet = walletContent.id;
    }
    });
  
    const symbol = document.getElementById("symbolselected").textContent;
    const ammount = document.getElementById("quantity-input").value;
    
    console.log(wallet, symbol, ammount)
    let type;
    const buy = document.getElementById("Buy");
    const sell = document.getElementById("Sell");

    if (buy.classList.contains("active")) {
        type = true
    }

    if (sell.classList.contains("active")) {
        type = false
    }
    let transaction = new Transaction(symbol, ammount, type, user.id, wallet)
    await transaction.transac();
    setTimeout(function(){
        location.reload();
     }, 500);
    //location.reload();
  }