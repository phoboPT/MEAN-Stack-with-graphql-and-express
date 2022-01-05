import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
let client;
try {
  if (!client) {
    client = new pg.Client({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });
    client.connect();
  }
} catch (error) {
  console.log(error);
}

const query = (query) => {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    client.query(query, (err, res) => {
      if (err) {
        console.log(`error: ${err}`);
        reject(err);
      } else {
        const duration = Date.now() - start;
        console.log("executed query", { query, duration, rows: res.rowCount });
        resolve(res);
      }
    });
  });
};

export { query };
