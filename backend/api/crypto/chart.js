export const defaultCryptoChartOptions = {
    layout: {
      textColor: 'transparent',
      background: {
        type: 'solid',
        color: 'transparent'
      }
    },
    rightPriceScale: {
    visible: false,
  },
    timeScale: {
        visible: false,
    },
    scaleMargins: {
        left: 0,
        right: 0
    },
    with: 250,
    grid: {
      vertLines: {
        visible: false
      },
      horzLines: {
        visible: false
      }
    },
    crosshair: {
        vertLine: {
            visible: false,
        },
        horzLine: {
            visible: false,
        },
        marker : null
    },
    priceLineVisible: false,
    handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
        vertTouchDrag: false
      },
      handleScale: {
          axisPressedMouseMove: false,
          mouseWheel: false,
          pinch: false,
    },
  };
  export async function getCryptoChartHistoricalData(cryptoSymbol) {
    const now = Math.floor(Date.now() / 1000);
    const thirtyMinutesInSeconds = 30 * 60;
    const oneWeekInSeconds = 7 * 24 * 60 * 60;
    const oneWeekAgoInSeconds = now - oneWeekInSeconds;
    const limit = Math.ceil(oneWeekInSeconds / thirtyMinutesInSeconds);
    const url = `https://min-api.cryptocompare.com/data/v2/histominute?fsym=${cryptoSymbol}&tsym=USD&limit=${limit}&toTs=${now}&api_key=d3d157bbd232f7136bcdfcb4bebc9af3777422913c967da39cbb21fddcf6c8d6`;
    const response = await fetch(url);
    const data = await response.json();

    const historicalData = data.Data.Data.map(d => ({
        time: d.time * 1000,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume
    }));
    
    const chartData = historicalData.map(data => {
        const time = new Date(data.time);
        const value = (data.open + data.high + data.low + data.close) / 4;
        return { time: time.getTime(), value: value.toFixed(2) };
    });

    return chartData;
}

export async function loadCryptoChart(cyrptoSymbol, chartContainerId, chartColor, chartOptions){
    const chart = LightweightCharts.createChart(document.getElementById(chartContainerId), chartOptions);
    const areaSeries = chart.addAreaSeries({
        lineColor: chartColor[0],
        lineType: 0, topColor: chartColor[1],
        bottomColor: 'transparent',
        crosshairMarkerVisible: false,
        priceLineVisible: false,
        width: 250
        });
    const data = await getCryptoChartHistoricalData(cyrptoSymbol);
    areaSeries.setData(data);
    await chart.resize(chartOptions.width, chartOptions.height);
    await chart.timeScale().fitContent();
  }