import { User } from "/backend/user/user.js";
import { CryptoWallet } from "/backend/user/wallets.js";
let user = new User()


window.addEventListener("load", async function() {
    document.getElementById("loaderbackground").style.display = "block";
    document.getElementById("dashboardpage").style.display= "none";
    await loadpage();
    setTimeout(await showPage, 1000);
});

async function loadpage(){
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '409414f4dbmsh7a2f43c31f9de94p124423jsn608597d0f492',
            'X-RapidAPI-Host': 'realstonks.p.rapidapi.com'
        }
    };
    
    fetch('https://realstonks.p.rapidapi.com/TSLA', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
    await user.setUserData();
    document.getElementById("profilepictureimg").src = user.profilepicture;
    document.getElementById("username").innerHTML =  user.username
    document.getElementById("totalbalance").innerHTML = (await user.getBalance()) +"$"
    const container = document.getElementById('walletsContainer');
    let index = 0
    for (const wallet in user.wallets) {
        let cryptowallet = new CryptoWallet(wallet, user.wallets[wallet].cryptos )
        const boxHtml = `
        <button id="${wallet}" class="card">
            <div class="card-top">
                <div class="card-info">
                    <h1 class="card-name">${wallet}</h1>
                </div>
            </div>
        </button>
    `
    await container.insertAdjacentHTML('beforeend', boxHtml);
    await document.getElementById(wallet).addEventListener("click", function(){
        console.log(wallet)
        location.href = 'http://localhost:5500/frontend/pages/dashboard/wallet.html';
    })
    }
    
}
 
async function showPage() {
    document.getElementById("loaderbackground").style.display = "none";
    document.getElementById("dashboardpage").style.display = "grid";
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