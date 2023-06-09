export async function getCurrencyPrice(symbol){
    try{
        const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=usd&apikey=OQRIU4CQ4W9KC9DK`)
        const data = await response.json()
        console.log(data)
        const exchangeRate = data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
        return parseFloat(exchangeRate).toFixed(2)
    }
    catch{
        return 1
    }
}