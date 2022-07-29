import pgConnect from "../pgConnect.js";
let client;
let tableName;
export const getAllContent = async (req, res, next) => {
    try {
        client = pgConnect();
        let query;
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
                    throw new Error("invalid API endpoint. Available: [coinmarket, coinbase, coinstats, paprika, all]");
            }
        }
        else {
            throw new Error("invalid API endpoint. Available: [coinmarket, coinbase, coinstats, paprika]");
        }
        const dates = req.body;
        if (dates.startDate && dates.endDate) {
            const dateRegEx = /^\d{4}([-])\d{2}\1\d{2}\s\d{2}([:])\d{2}\2\d{2}$/;
            if (dates.startDate.match(dateRegEx) && dates.endDate.match(dateRegEx)) {
                query = `SELECT * FROM cryptodata.${tableName} WHERE date_time between '${dates.startDate}' and '${dates.endDate}'`;
            }
            else {
                throw new Error("Invalid date format. It should be YYYY-MM-DD HH:MM:SS");
            }
        }
        else {
            query = `SELECT * FROM cryptodata.${tableName}`;
        }
        const content = await client.query(query);
        const objKeys = content.rows.map((item) => {
            return item.currency;
        });
        const objKeysSet = Array.from(new Set(objKeys));
        const data = objKeysSet.map((item) => {
            const oneItemContent = content.rows.filter((el) => el.currency == item);
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
    }
    catch (e) {
        res.send(e.message);
    }
    finally {
        client.end();
    }
};
export const getCurrencyInfo = async (req, res, next) => {
    try {
        const params = req.params;
        const dates = req.body;
        client = pgConnect();
        let query;
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
                    throw new Error("invalid API endpoint. Available: [coinmarket, coinbase, coinstats, paprika, all]");
            }
        }
        else {
            throw new Error("invalid API endpoint. Available: [coinmarket, coinbase, coinstats, paprika, all]");
        }
        if (dates.startDate && dates.endDate) {
            const dateRegEx = /^\d{4}([-])\d{2}\1\d{2}\s\d{2}([:])\d{2}\2\d{2}$/;
            if (dates.startDate.match(dateRegEx) && dates.endDate.match(dateRegEx)) {
                query = `SELECT * FROM cryptodata.${tableName} WHERE currency = '${params.currency.toLocaleUpperCase()}' and date_time between '${dates.startDate}' and '${dates.endDate}'`;
            }
            else {
                throw new Error("Invalid date format. It should be YYYY-MM-DD HH:MM:SS");
            }
        }
        else {
            query = `SELECT * FROM cryptodata.${tableName} WHERE currency = '${params.currency.toLocaleUpperCase()}'`;
        }
        const content = await client.query(query);
        const contentRows = content.rows;
        if (contentRows.length == 0) {
            throw new Error("This currency doesn't exist. Please type correct currency name!");
        }
        const data = {
            currency: contentRows[0].currency,
            info: contentRows.map((item) => {
                return {
                    price: item.price,
                    date_time: item.date_time,
                };
            }),
        };
        res.send(data);
    }
    catch (e) {
        res.send(e.message);
    }
    finally {
        client.end();
    }
};
