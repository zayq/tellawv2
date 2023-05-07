const wallettypesbtns = document.querySelectorAll(".wallet-type");

wallettypesbtns.forEach(wallettype => {
  wallettype.addEventListener("click", function() {
    selectWalletType(wallettype);
  });
});

function selectWalletType(clickedWalletType) {
  wallettypesbtns.forEach(wallettype => {
    wallettype.classList.remove("active");
  });

  clickedWalletType.classList.add("active");
}


//////////////////////

const logos = document.querySelectorAll(".wallet-logo");

logos.forEach(logo => {
  logo.addEventListener("click", function() {
    selectLogo(logo);
  });
});

function selectLogo(logoSelected) {
  logos.forEach(logo => {
    logo.classList.remove("active");
  });

  logoSelected.classList.add("active");
}