import { data } from "/backend/database/crypto_list.js";
import { getCryptoPrice, getCryptoImageUrl} from "/backend/api/crypto/crypto.js";


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
          <h2 class="symbolspanselected">${selectedCoin.toUpperCase()}</h2>
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
}