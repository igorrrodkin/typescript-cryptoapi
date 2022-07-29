import { RequestHandler } from "express";
import pg from "pg";
import pgConnect from "../pgConnect.js";
import { oneCurrency , datesInterval} from "../types/types.js"

let client: pg.Client;
let tableName: string;
export const getAllContent: RequestHandler = async (req, res, next) => {
  try {
    client = pgConnect();
    let query: string;
    const params = req.params;
    if (params.api) {
      switch (params.api) {
        case "coinmarket":
          tableName = "coinmarket";
          break;
        case "coinbase":
          tableName = "coinbase";
          break;
        case "coinstats":
          tableName = "coinstats";
          break;
        case "paprika":
          tableName = "paprika";
          break;
        case 'all':
          tableName = "averagedata";
          break;
        default:
          throw new Error(
            "invalid API endpoint. Available: [coinmarket, coinbase, coinstats, paprika, all]"
          );
      }
    } else {
      throw new Error(
        "invalid API endpoint. Available: [coinmarket, coinbase, coinstats, paprika]"
      );
    }
    const dates: datesInterval = req.body;
    if (dates.startDate && dates.endDate) {
      const dateRegEx: RegExp =
        /^\d{4}([-])\d{2}\1\d{2}\s\d{2}([:])\d{2}\2\d{2}$/;
      if (dates.startDate.match(dateRegEx) && dates.endDate.match(dateRegEx)) {
        query = `SELECT * FROM cryptodata.${tableName} WHERE date_time between '${dates.startDate}' and '${dates.endDate}'`;
      } else {
        throw new Error(
          "Invalid date format. It should be YYYY-MM-DD HH:MM:SS"
        );
      }
    } else {
      query = `SELECT * FROM cryptodata.${tableName}`;
    }
    const content: pg.QueryResult = await client.query(query);
    const objKeys: string[] = content.rows.map((item) => {
      return item.currency;
    });
    const objKeysSet: string[] = Array.from(new Set(objKeys));
    const data: oneCurrency[] = objKeysSet.map((item) => {
      const oneItemContent: {
        currency: string;
        price: number;
        date_time: Date;
      }[] = content.rows.filter((el) => el.currency == item);
      return {
        currency: item,
        info: oneItemContent.map((item) => {
          return {
            price: item.price,
            date_time: item.date_time,
          };
        }),
      };
    });
    res.send(data);
  } catch (e) {
    res.send((<Error>e).message);
  } finally {
    client.end();
  }
};

export const getCurrencyInfo: RequestHandler = async (req, res, next) => {
  try {
    const params = req.params;
    const dates: datesInterval = req.body;
    client = pgConnect();
    let query: string;
    if (params.api) {
      switch (params.api) {
        case "coinmarket":
          tableName = "coinmarket";
          break;
        case "coinbase":
          tableName = "coinbase";
          break;
        case "coinstats":
          tableName = "coinstats";
          break;
        case "paprika":
          tableName = "paprika";
          break;
        case 'all':
          tableName = "averagedata";
          break;
        default:
          throw new Error(
            "invalid API endpoint. Available: [coinmarket, coinbase, coinstats, paprika, all]"
          );
      }
    } else {
      throw new Error(
        "invalid API endpoint. Available: [coinmarket, coinbase, coinstats, paprika, all]"
      );
    }
    if (dates.startDate && dates.endDate) {
      const dateRegEx: RegExp =
        /^\d{4}([-])\d{2}\1\d{2}\s\d{2}([:])\d{2}\2\d{2}$/;
      if (dates.startDate.match(dateRegEx) && dates.endDate.match(dateRegEx)) {
        query = `SELECT * FROM cryptodata.${tableName} WHERE currency = '${params.currency.toLocaleUpperCase()}' and date_time between '${
          dates.startDate
        }' and '${dates.endDate}'`;
      } else {
        throw new Error(
          "Invalid date format. It should be YYYY-MM-DD HH:MM:SS"
        );
      }
    } else {
      query = `SELECT * FROM cryptodata.${tableName} WHERE currency = '${params.currency.toLocaleUpperCase()}'`;
    }
    const content: pg.QueryResult = await client.query(query);
    const contentRows: { currency: string; price: number; date_time: Date }[] =
      content.rows;
    if (contentRows.length == 0) {
      throw new Error(
        "This currency doesn't exist. Please type correct currency name!"
      );
    }
    const data: oneCurrency = {
      currency: contentRows[0].currency,
      info: contentRows.map((item) => {
        return {
          price: item.price,
          date_time: item.date_time,
        };
      }),
    };
    res.send(data);
  } catch (e) {
    res.send((<Error>e).message);
  } finally {
    client.end();
  }
};



// export const coinMarketData = async () => {
//   await axios
//     .get<{ data: { symbol: string; quote: { USD: { price: number } } }[] }>(
//       "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
//       {
//         headers: {
//           "X-CMC_PRO_API_KEY": "aac68a23-a652-4291-87db-bb9aa01b017c",
//         },
//         params: {
//           start: "1",
//           convert: "USD",
//         },
//       }
//     )
//     .then((res) => res.data.data)
//     .then((content) => {
//       const response: Response[] = content.map((item) => {
//         return {
//           symbol: item.symbol,
//           price: item.quote.USD.price,
//         };
//       });
//       // console.log(response)
//       return response;
//       // res.status(200).send(response);
//     });
// };

// export const coinstatsData = async () => {
//   await axios
//     .get<{ coins: { symbol: string; price: number }[] }>(
//       "https://api.coinstats.app/public/v1/coins?skip=0&currency=USD"
//     )
//     .then((res) => res.data.coins)
//     .then((content) => {
//       const response: Response[] = content.map((item) => {
//         return {
//           symbol: item.symbol,
//           price: item.price,
//         };
//       });
//       // res.send(response);
//       return response;
//     });
// };

// export const paprikaData = async () => {
//   await axios
//     .get<{ symbol: string; quotes: { USD: { price: number } } }[]>(
//       "https://api.coinpaprika.com/v1/tickers"
//     )
//     .then((res) => res.data)
//     .then((content) => {
//       const response: Response[] = content.map((item) => {
//         return {
//           symbol: item.symbol,
//           price: item.quotes.USD.price,
//         };
//       });
//       // res.status(200).send(response);
//       return response;
//     });
// };

// export const coinbaseData = async () => {
//   await axios
//     .get<{ data: { rates: { [key: string]: string } } }>(
//       "https://api.coinbase.com/v2/exchange-rates?currency=USD"
//     )
//     .then((res) => res.data.data.rates)
//     .then((content) => {
//       console.log(Object.entries(content));
//       const response: Response[] = Object.entries(content).map((item) => {
//         return {
//           symbol: item[0],
//           price: parseFloat(item[1]),
//         };
//       });
//       // res.status(200).send(response);
//       return response;
//     });
// };

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
