import { getAllConnectorsData } from "./transform.js";
import pg from "pg";
import { coinMarketData, coinbaseData, coinstatsData, paprikaData} from "./extractors.js"

export const loadContent = async (client: pg.Client) => {
  const content: Object[] = await getAllConnectorsData();
  const queryAverage: string = `CREATE TABLE IF NOT EXISTS cryptodata.averagedata("currency" TEXT, "price" NUMERIC, "date_time" TIMESTAMP);\n INSERT INTO cryptodata.averagedata("currency", "price", "date_time") VALUES\n ${getFormatValues(
    content
  )}`;
  client.query(queryAverage);

  const contentCoinMarket = await coinMarketData();
  const queryCoinMarket: string = `CREATE TABLE IF NOT EXISTS cryptodata.coinmarket("currency" TEXT, "price" NUMERIC, "date_time" TIMESTAMP);\n INSERT INTO cryptodata.coinmarket("currency", "price", "date_time") VALUES\n ${getFormatValues(
    contentCoinMarket
  )}`;
  client.query(queryCoinMarket);

  const contentCoinbase = await coinbaseData();
  const queryCoinbase: string = `CREATE TABLE IF NOT EXISTS cryptodata.coinbase("currency" TEXT, "price" NUMERIC, "date_time" TIMESTAMP);\n INSERT INTO cryptodata.coinbase("currency", "price", "date_time") VALUES\n ${getFormatValues(
    contentCoinbase
  )}`;
  client.query(queryCoinbase);

  const contentCoinStats = await coinstatsData();
  const queryCoinStats: string = `CREATE TABLE IF NOT EXISTS cryptodata.coinstats("currency" TEXT, "price" NUMERIC, "date_time" TIMESTAMP);\n INSERT INTO cryptodata.coinstats("currency", "price", "date_time") VALUES\n ${getFormatValues(
    contentCoinStats
  )}`;
  client.query(queryCoinStats);

  const contentPaprika = await paprikaData();
  const queryPaprika: string = `CREATE TABLE IF NOT EXISTS cryptodata.paprika("currency" TEXT, "price" NUMERIC, "date_time" TIMESTAMP);\n INSERT INTO cryptodata.paprika("currency", "price", "date_time") VALUES\n ${getFormatValues(
    contentPaprika
  )}`;
  client.query(queryPaprika);
};

const getFormatValues = (content: Object[]): string => {
  let values_string: string = "";
  for (let values of content) {
    values_string += `('${Object.values(values).join(
      "','"
    )}', '${formatDate()}'),`;
  }
  return values_string.slice(0, -1);
};

const padTo2Digits = (num: number): string => {
  return num.toString().padStart(2, "0");
};

const formatDate = (): string => {
  const date: Date = new Date();
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
};
