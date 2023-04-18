export async function getCryptoPrice(crypto){
    const response = await fetch("https://min-api.cryptocompare.com/data/price?fsym=" + crypto +"&tsyms=USD&api_key=d3d157bbd232f7136bcdfcb4bebc9af3777422913c967da39cbb21fddcf6c8d6");
    const data = await response.json();
    const price = data.USD;
    return price.toFixed(2);
}
export async function getCryptoImageUrl(crypto) {
    const response = await fetch("https://data-api.cryptocompare.com/asset/v1/data/by/symbol?asset_symbol=" + crypto);
    const data = await response.json();
    return data.Data.LOGO_URL;
}
export async function getCryptoPriceChange(crypto) {
    const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${crypto}&tsym=USD&limit=2`);
    const data = await response.json();
    const change = ((data.Data.Data[1].close - data.Data.Data[0].close) / data.Data.Data[0].close) * 100;
    const changeString = change.toFixed(2);
    return changeString;
}
export async function getMarketCap(crypto){
    const response = await fetch("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + crypto + "&tsyms=USD")
    const data = await response.json();
    return data.RAW[crypto.toUpperCase()].USD.MKTCAP.toFixed(2)
}