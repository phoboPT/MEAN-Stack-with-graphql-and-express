import express from "express";
import { query } from "../db.js";
import { parser } from "../lib/utils.js";
import { outletModel, productModel } from "../models/model.js";
const router = express.Router();
let lock = false;

router.get("/migrate", async (req, res) => {
  try {
    console.log("migration started");
    console.log(`lock ${lock}`);
    if (lock) {
      return res
        .status(423)
        .send(
          "A migration is already in progress, wait for the completion, you can check the state at /migrate/state"
        );
    }
    res.status(200).send("Migration started");
    migration();
  } catch (error) {
    console.log(error);
    lock = false;
    console.log(`lock ${lock}`);
    res.status(400).send(`An error as occured: ${error}`);
  }
});

router.get("/migrate/state", async (req, res) => {
  try {
    console.log(`lock ${lock}`);
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
    res.status(500).send(`An error as occured: ${error}`);
  }
});
router.get("/migrate/free", async (req, res) => {
  try {
    lock = false;
    console.log(`lock ${lock}`);
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
    res.status(500).send(`An error as occured: ${error}`);
  }
});

const migration = async () => {
  try {
    lock = true;
    console.log(`migration started, lock ${lock}`);
    const data = await query("SELECT * FROM xml");
    const outlets = await parser(data);
    await saveData(outlets);
    return true;
  } catch (error) {
    console.log(`Error: ${error}`);
    lock = false;
    console.log(`lock ${lock}`);
    res.status(500).send(`An error as occured: ${error}`);
  } finally {
    lock = false;
    console.log(`lock ${lock}`);
  }
};

const saveData = async (outlets) => {
  console.log("saving data");
  try {
    for (const [key, outlet] of Object.entries(outlets)) {
      const products = [];
      for await (const product of outlet.products) {
        const productExist = await productModel.findOne({ id: product.id });
        if (!productExist) {
          const newProduct = new productModel({
            id: product.id,
            name: product.name,
            type: product.type,
            weight: product.weight,
            mrp: product.mrp,
          });
          const item = await newProduct.save();
          if (item) {
            if (!products.includes(item._id)) {
              products.push(item._id);
            }
          }
        } else {
          if (!products.includes(productExist._id)) {
            products.push(productExist._id);
          }
        }
      }
      const exist = await outletModel.findOne({ id: outlet.id });
      if (!exist) {
        const newOutlet = new outletModel({
          id: outlet.id,
          name: outlet.name,
          size: outlet.size,
          year: outlet.year,
          locationType: outlet.locationType,
          sales: outlet.sales,
          products,
        });
        await newOutlet.save();
        console.log("saved");
      }
    }
    console.log("data saved");
  } catch (error) {
    console.log(error);
  }
};

export { router as migrationRouter };
