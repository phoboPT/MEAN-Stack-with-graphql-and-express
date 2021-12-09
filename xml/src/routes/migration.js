import express from "express";
import { query } from "../db.js";
import xmldoc from "xmldoc";
const router = express.Router();
let lock = false;
router.get("/migrate", async (req, res) => {
  try {
    if (lock) {
      return res
        .status(423)
        .send(
          "A migration is already in progress, wait for the completion, you can check the state at /migrate/state"
        );
    }
    // migration();
    lock = true;
    res.status(200).send("Migration started");
  } catch (error) {
    console.log(error);
    lock = false;
    res.status(400).send(`Ocorreu um erro ao migrar: ${error}`);
  }
});

router.get("/migrate/state", async (req, res) => {
  try {
    res
      .status(`${lock ? 423 : 200}`)
      .send(
        `${
          lock
            ? "A migration is already in progress, wait for the completion"
            : "Free"
        }`
      );
  } catch (error) {
    console.log(error);
  }
});
router.get("/migrate/free", async (req, res) => {
  try {
    lock = false;
    res
      .status(`${lock ? 423 : 200}`)
      .send(
        `${
          lock
            ? "A migration is already in progress, wait for the completion"
            : "Migration free"
        }`
      );
  } catch (error) {
    console.log(error);
  }
});

const migration = async () => {
  lock = true;
  const data = await query("SELECT * FROM xml");

  data.rows.forEach((item) => {
    const string = item.xml.replace(/(\r\n|\n|\r)/gm, "").trim();

    const document = new xmldoc.XmlDocument(string);

    const items = document.descendantWithPath("Items").toString();
    const shops = document.descendantWithPath("Outlet").toString();
    const types = document.descendantWithPath("Types").toString();
    const outletSize = document.valueWithPath("OutletSizes").toString();
    const products = document.descendantWithPath("Products").toString();
  });
  lock = false;
};

export { router as migrationRouter };
