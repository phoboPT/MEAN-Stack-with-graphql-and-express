import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

// try {
//   const client = new pg.Client({
//     host: "localhost:5432",
//     user: "mendix",
//     password: "mendix",
//     database: "db0",
//   });
//   client.connect();
// } catch (error) {
//   console.log(error);
// }

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
