import axios from "axios";
export const coinMarketData = async () => {
    const response = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
        headers: {
            "X-CMC_PRO_API_KEY": "aac68a23-a652-4291-87db-bb9aa01b017c",
        },
        params: {
            start: "1",
            convert: "USD",
        },
    });
    const content = response.data.data.map((item) => {
        return {
            symbol: item.symbol,
            price: item.quote.USD.price,
        };
    });
    return content;
};
export const coinstatsData = async () => {
    const response = await axios.get("https://api.coinstats.app/public/v1/coins?skip=0&currency=USD");
    const content = response.data.coins.map((item) => {
        return {
            symbol: item.symbol,
            price: item.price,
        };
    });
    return content;
};
export const paprikaData = async () => {
    const response = await axios.get("https://api.coinpaprika.com/v1/tickers");
    const content = response.data.map((item) => {
        return {
            symbol: item.symbol,
            price: item.quotes.USD.price,
        };
    });
    return content;
};
export const coinbaseData = async () => {
    const response = await axios.get("https://api.coinbase.com/v2/exchange-rates?currency=USD");
    const content = Object.entries(response.data.data.rates).map((item) => {
        return {
            symbol: item[0],
            price: 1 / parseFloat(item[1]),
        };
    });
    return content;
};
