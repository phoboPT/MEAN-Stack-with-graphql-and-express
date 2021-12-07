import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app.js";
import pg from "pg";

dotenv.config();
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    const client = new pg.Client({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });

    client.connect();

    // const res = await client.query("SELECT * FROM xml");

    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server started on port ${process.env.PORT || 4000}`);
    });
  } catch (err) {
    console.log(`error: ${err}`);
  }
};

start();
