import {
  coinMarketData,
  coinbaseData,
  coinstatsData,
  paprikaData,
} from "./extractors.js";

export const getAllConnectorsData = async () => {
  const data = await Promise.all([
    coinMarketData(),
    coinstatsData(),
    coinbaseData(),
    paprikaData(),
  ]);
  const arrPrices: { [key: string]: number[] } = {};
  for (let content of data) {
    for (let coin of content) {
      let symbol = coin.symbol;
      if (symbol in arrPrices) {
        let pricesArr: number[] = arrPrices[symbol];
        pricesArr.push(coin.price);
      } else {
        arrPrices[symbol] = [coin.price];
      }
    }
  }
  const averagePrice: { [key: string]: number } = {};
  for (let item of Object.entries(arrPrices)) {
    let average =
      item[1].reduce((a: number, b: number) => a + b, 0) / item[1].length;
    averagePrice[item[0]] = average;
  }
  const content: Object[] = Object.entries(averagePrice).map((item) => {
    return {
      symbol: item[0],
      price: item[1],
    };
  });
  return content;
};
