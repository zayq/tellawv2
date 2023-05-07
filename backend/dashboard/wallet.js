import { User } from "/backend/user/user.js";
import { CryptoWallet } from "/backend/user/wallets.js";
import { getCryptoPrice, getCryptoImageUrl, getMarketCap, getCryptoPriceChange1h, getCryptoPriceChange24h, getCryptoPriceChange7d} from "/backend/api/crypto/crypto.js";
import { Transaction, createWallet } from "/backend/user/transaction.js";
import { data } from "/backend/database/crypto_list.js";
import { getCryptoPriceChange } from "../api/crypto/crypto.js";
import { defaultCryptoChartOptions, getCryptoChartHistoricalData, loadCryptoChart } from "../api/crypto/chart.js";
import { CurrencyWallet } from "../user/wallets.js";
import { getCurrencyPrice } from "../api/currency/currency.js";
let user = new User()

async function loadWallet(wallet){
  await user.setUserData();
  let walletsContainer = document.getElementById("wallets-container");
    walletsContainer.innerHTML = `
        <div class="loader-container">
        <div class="loader"></div>
    </div>
    `;
      let walletobj;
      console.log(typeof(user.wallets[wallet].type) + user.wallets[wallet].type)
      if (user.wallets[wallet].type == "Crypto"){
        walletobj = new CryptoWallet(wallet, user.wallets[wallet].cryptos)
        let boxCrypto = `
        <div class="element">
        `
        for (const crypto in user.wallets[wallet].cryptos){
          const mktcap = await getMarketCap(crypto)
          const logo = await getCryptoImageUrl(crypto);
          const pricechange = await getCryptoPriceChange(crypto)
          let pricechangebool;
          let priceColorClass;
      
          if (pricechange > 0){
              pricechangebool = `<i class="fa-sharp fa-solid fa-caret-up"></i>${await getCryptoPrice(crypto)}`
              priceColorClass = 'green';
          } else if (pricechange < 0) {
              pricechangebool = `<i class="fa-sharp fa-solid fa-caret-down"></i>${await getCryptoPrice(crypto)}`
              priceColorClass = 'red';
          } else {
              pricechangebool = `${await getCryptoPrice(crypto)}`
              priceColorClass = '';
          }
      
          boxCrypto += `
              <div class="${crypto}">
                  <div class="name">
                      <img src="${logo}">
                      ${crypto}
                  </div>
                  <div class="price p ${priceColorClass}">
                      ${pricechangebool}
                  </div>
                  <div class="amount">${await getCryptoPriceChange1h(crypto)}</div>
                  <div class="amount">${await getCryptoPriceChange24h(crypto)}</div>
                  <div class="amount">${await getCryptoPriceChange7d(crypto)}</div>
                  <div class="amount">${user.wallets[wallet].cryptos[crypto].toFixed(2)}</div>
                  <div class="marketcap">${mktcap}</div>
                  <div class="graph" id="${crypto}-graph"></div>
              </div>
          `;
      }
  
        let boxHtml = `
            <div id="${wallet}" class="walletcontent">
            <div class="wallettitle">
                <h1>${wallet}</h1>
                <h4 id="wallet-type">${user.wallets[wallet].type}</h4>
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
                    <div>
                      <canvas id="donutchart">
                      </canvas>
                    </div>
                </div>
            </div>
            
            <div class="walletelements">
                <div class="description">
                <div class="header-wallet">
                    <div class="name">Name</div>
                    <div class="price">Price</div>
                    <div class="amount">1h</div>
                    <div class="amount">24h</div>
                    <div class="amount">7d</div>
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
      walletsContainer.innerHTML = boxHtml;
    const transactionbtns = document.getElementById("transacbtn");
    transactionbtns.addEventListener("click", openWindow)
  
    if (user.wallets[wallet].type == "Crypto"){
      loadDoughnutGraph(wallet)
    }
  
  
    for (const crypto in user.wallets[wallet].cryptos){
      loadCryptoChart(crypto, crypto + "-graph", ["#16c784", "#16c784"], defaultCryptoChartOptions)
    }  
  
      }
      else{
        walletobj = new CurrencyWallet(wallet, user.wallets[wallet].currencies)
        console.log("fuclk")
        let boxCrypto = `
        <div class="element">
        `
        for (const currency in user.wallets[wallet].currencies){
          const exchangeRate = await getCurrencyPrice(currency)
      
          boxCrypto += `
              <div class="${currency}">
                  <div class="name">
                    <object type="image/svg+xml" data="/backend/api/currency/logo/${currency}.svg">
                    Your browser does not support SVG
                    </object>
                      ${currency}
                  </div>
                  <div class="price">
                      ${exchangeRate}
                  </div>

                  <div class="amount">${user.wallets[wallet].currencies[currency].toFixed(2)}</div>
              </div>
          `;
      }
  
        let boxHtml = `
            <div id="${wallet}" class="walletcontent">
            <div class="wallettitle">
                <h1>${wallet}</h1>
                <h4 id="wallet-type">${user.wallets[wallet].type}</h4>
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
                    <div>
                      <canvas id="donutchart">
                      </canvas>
                    </div>
                </div>
            </div>
            
            <div class="walletelements">
                <div class="description">
                <div class="header-wallet">
                    <div class="name">Name</div>
                    <div class="price">Price</div>
                    <div class="amount">Amount</div>
                </div>
            </div>
            `
        boxCrypto += `</div></div>
        </div>
    </div>`
        boxHtml += boxCrypto
      walletsContainer.innerHTML = boxHtml;
    const transactionbtns = document.getElementById("transacbtn");
    transactionbtns.addEventListener("click", openWindow)
      }


}

async function loadleftwallets(){
    await user.setUserData();
    const container = document.getElementById("leftwallets");
    container.innerHTML = ``
    let boxHtml = "";
    for (const wallet in user.wallets){
      //<div id="${wallet}-btn">${wallet}</div>
        boxHtml += `
         <div id="${wallet}-btn" class="w">
         <div class="logoimg">
         <img src="${user.wallets[wallet].logo}" alt="">
         </div>
         <div>
         <p>${wallet}</p>
         <p>${user.wallets[wallet].type}</p>
         </div>
         </div>
        `

    }
    await container.insertAdjacentHTML("beforeend", boxHtml)

    let walletbtnhtml = `
      <span id="createwallet-btn" class="createwallet-btn">
        <i class="fa-solid fa-plus"></i>
        Create Wallet
      </span>
    `

    await container.insertAdjacentHTML("beforeend", walletbtnhtml)

    

    for (const wallet in user.wallets){
        const walletbtn = document.getElementById(`${wallet}-btn`);
        walletbtn.addEventListener("click", () => loadWallet(walletbtn.querySelector("p").textContent));
    }
    const walletNames = Object.keys(user.wallets);
    const firstWalletName = walletNames[0];
    await loadWallet(firstWalletName)

    const createwalletbtn = document.getElementById("createwallet-btn")

    createwalletbtn.addEventListener("click", function(){
      document.getElementById("createwallet-window").style.display = "flex"
      console.log("kcdjsh")
      isCreateWalletWindow = true
    })
}

await loadleftwallets()


const transactionWindow = document.getElementById("transaction-window");
const transactionWindowCurrency = document.getElementById("window-transaction-currency")
let isWindowOpen = false



function openWindow(){
    const type = document.getElementById("wallet-type").innerHTML
    console.log(type)
    if (type == "Crypto"){
      transactionWindow.style.display = "flex";
    }
    else{
      transactionWindowCurrency.style.display = "flex"
    }
    
    isWindowOpen = true;
}

function closeWindow(){
    const type = document.getElementById("wallet-type").innerHTML
    if (type == "Crypto"){
      transactionWindow.style.display = "none";
    }
    else{
      transactionWindowCurrency.style.display = "none"
    }
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
        document.getElementById("transaction-window").style.display = "none"
        loadWallet(wallet);
     }, 500);
  }

var donut = document.getElementById("donutchart").getContext('2d');

async function getAssetsForGraph(cryptos){
  const chartData = [];

  for (const [name, amount] of Object.entries(cryptos)) {
    let price = await getCryptoPrice(name)
    let holding = price * amount
    chartData.push({
      name,
      holding,
    });
  }

  return chartData;
}

async function loadDoughnutGraph(walletname){
  var donut = document.getElementById("donutchart").getContext('2d');
  const chartData = await getAssetsForGraph(user.wallets[walletname].cryptos);
  const myChart = new Chart(donut, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: chartData.map(crypto => crypto.holding),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          // Add more colors here if needed
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          // Add more colors here if needed
        ],
        borderWidth: 0,
        label: '', // Optional label for the dataset
      }],
      labels: chartData.map(crypto => crypto.name),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Doughnut Chart'
      }
    }
  });
}





const ButtonSetting = document.getElementById("settingsbtn");
const SettingPage = document.getElementById("settingpage");
var isSettingWindowOpen = false; 
ButtonSetting.addEventListener("click", openSettingWindow)
document.addEventListener("click",function (event){
  if(event.target.closest("#settingpage") || event.target.closest("#settingsbtn"))
  return
  else{
    if(isSettingWindowOpen){
      closeSettingWindow()
    }
  }
});
function closeSettingWindow(){
  SettingPage.style.display = "none";
  isSettingWindowOpen = false
}
function openSettingWindow(){
  SettingPage.style.display = "flex";
  isSettingWindowOpen = true
}



// TOOGLE DARK-WHITE MODE
const toggleSwitch = document.querySelector('.switch');

function switchTheme(e) {
    if (!e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, true);


const ProfilePage = document.getElementById("settingprofilepage");
const ProfileBtn = document.getElementById("profilebtn");
const SecurityBtn = document.getElementById("accountsecuritybtn");
const SecurityPage = document.getElementById("settingaccountsecuritypage");

SecurityBtn.addEventListener("click", openSecurityPage)
function openSecurityPage(){
  SecurityPage.style.display = "flex"
  ProfilePage.style.display = "none"
}
ProfileBtn.addEventListener("click", openProfilePage)
function openProfilePage(){
  SecurityPage.style.display = "none"
  ProfilePage.style.display = "flex"
}

///////////////////////////////////
// CREATE WALLET FUNCTION
///////////////////////////////////



const createwalletbtn = document.getElementById("create-wallet-btn")

createwalletbtn.addEventListener("click", async function(){
    const wallettypesbtns = document.querySelectorAll(".wallet-type");
    const logos = document.querySelectorAll(".wallet-logo");

    const walletname = document.getElementById("wallet-name").value
    let wallettype;
    let walletlogo;

    wallettypesbtns.forEach(type => {
      if (type.classList.contains("active")){
        wallettype = type.querySelector('h1').innerText
      }
    });
    logos.forEach(logo => {
      if (logo.classList.contains("active")){
        walletlogo = logo.getAttribute("src")
      }
    });
    console.log(walletname +  " / " + wallettype +  " / " + walletlogo)
    await createWallet(walletname, wallettype, walletlogo, user.id)

    closeCreateWalletWindow()
    await loadleftwallets()
})

const CreateWalletPage = document.getElementById("createwallet-window");
var isCreateWalletWindow = false; 
document.addEventListener("click",function (event){
  if(event.target.closest("#createwallet-window") || event.target.closest("#createwallet-btn"))
  return
  else{
    if(isCreateWalletWindow){
      closeCreateWalletWindow()
    }
  }
});
function closeCreateWalletWindow(){
  CreateWalletPage.style.display = "none";
  isCreateWalletWindow = false
}