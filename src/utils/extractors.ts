import axios from "axios";

type Content = {
  symbol: string;
  price: number;
};

export const coinMarketData = async () => {
  const response = await axios.get<{
    data: { symbol: string; quote: { USD: { price: number } } }[];
  }>("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
    headers: {
      "X-CMC_PRO_API_KEY": "aac68a23-a652-4291-87db-bb9aa01b017c",
    },
    params: {
      start: "1",
      convert: "USD",
    },
  });
  const content: Content[] = response.data.data.map((item) => {
    return {
      symbol: item.symbol,
      price: item.quote.USD.price,
    };
  });
  return content;
};

export const coinstatsData = async () => {
  const response = await axios.get<{
    coins: { symbol: string; price: number }[];
  }>("https://api.coinstats.app/public/v1/coins?skip=0&currency=USD");
  const content: Content[] = response.data.coins.map((item) => {
    return {
      symbol: item.symbol,
      price: item.price,
    };
  });
  return content;
};

export const paprikaData = async () => {
  const response = await axios.get<
    { symbol: string; quotes: { USD: { price: number } } }[]
  >("https://api.coinpaprika.com/v1/tickers");
  const content: Content[] = response.data.map((item) => {
    return {
      symbol: item.symbol,
      price: item.quotes.USD.price,
    };
  });
  return content;
};

export const coinbaseData = async () => {
  const response = await axios.get<{
    data: { rates: { [key: string]: string } };
  }>("https://api.coinbase.com/v2/exchange-rates?currency=USD");

  const content: Content[] = Object.entries(response.data.data.rates).map(
    (item) => {
      return {
        symbol: item[0],
        price: 1/parseFloat(item[1]),
      };
    }
  );
  return content;
};

// export const kucoinData: RequestHandler = async (req, res, next) => {
//   await axios
//     .get<{ data: { [key: string]: string } }>(
//       "https://openapi-sandbox.kucoin.com/api/v1/prices"
//     )
//     .then((res) => res.data.data)
//     .then((content) => {
//       console.log(Object.entries(content));
//       const response: Response[] = Object.entries(content).map((item) => {
//         return {
//           symbol: item[0],
//           price: parseFloat(item[1]),
//         };
//       });
//       // res.status(200).send(response);
//       return response
//     });
// };
