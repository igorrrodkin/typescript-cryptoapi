import express from "express";
import cron from "node-cron";
import { loadContent } from "./utils/load.js";
import router from "./routes/cryptoRoutes.js";
// import dbConn from "./pgConnect.js";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use("/", router);

app.listen(2400, () => {
  console.log(`App is running on port ${2400}`);
  cron.schedule("*/5 * * * *", (): void => {
    // const client = dbConn();
    // loadContent(client);
    console.log("New content loaded", new Date());
  });
});
