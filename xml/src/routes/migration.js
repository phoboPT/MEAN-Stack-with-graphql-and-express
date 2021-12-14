import express from "express";
import { query } from "../db.js";
import xml2js from "xml2js";
import { outletModel } from "../models/model.js";
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
    res.status(200).send("Migration started");
    migration();
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
  try {
    console.log(`migration started, lock ${lock}`);
    lock = true;
    const data = await query("SELECT * FROM xml");
    const xml = [];
    for (const item of data.rows) {
      const xmLData = await xml2js.parseStringPromise(item.xml, {
        mergeAttrs: true,
      });
      xml.push(xmLData);
    }
    const parsedXML = { outlet: {}, items: {}, types: {}, outletSize: {} };
    xml.forEach((xmlItem) => {
      xmlItem.File.Outlet.forEach((outlet) => {
        outlet.Outlet.forEach((outletItem) => {
          if (!parsedXML.outlet[outletItem.id[0]]) {
            const newOutlet = {
              name: outletItem.name[0],
              id: outletItem.id[0],
            };
            parsedXML.outlet[outletItem.id[0]] = newOutlet;
          }
        });
      });

      xmlItem.File.Items.forEach((item) => {
        item.Item.forEach((itemItem) => {
          if (!parsedXML.items[itemItem.id[0]]) {
            const newItem = {
              name: itemItem.name[0],
              id: itemItem.id[0],
            };
            parsedXML.items[itemItem.id[0]] = newItem;
          }
        });
      });

      xmlItem.File.Types.forEach((type) => {
        type.Type.forEach((typeItem) => {
          if (!parsedXML.types[typeItem.id[0]]) {
            const newType = {
              name: typeItem.name[0],
              id: typeItem.id[0],
            };
            parsedXML.types[typeItem.id[0]] = newType;
          }
        });
      });

      xmlItem.File.OutletSizes.forEach((outletSize) => {
        outletSize.OutletSize.forEach((outletSizeItem) => {
          if (!parsedXML.outletSize[outletSizeItem.id[0]]) {
            const newOutletSize = {
              name: outletSizeItem.name[0],
              id: outletSizeItem.id[0],
            };
            parsedXML.outletSize[outletSizeItem.id[0]] = newOutletSize;
          }
        });
      });
    });
    const outlets = {};
    xml[0].File.Products.forEach((item) => {
      item.Item.forEach((item) => {
        const newOutlet = {
          id: parsedXML.outlet[item.outlet_id[0]].id,
          name: parsedXML.outlet[item.outlet_id[0]].name,
          size: parsedXML.outletSize[item.outlet_size_id[0]].name,
          year: item.Outlet_Year[0],
          locationType: item.Outlet_Lotation_Type[0],
          sales: item.Sales[0],
          products: [],
        };
        if (!outlets[newOutlet.id]) {
          outlets[newOutlet.id] = newOutlet;
        }

        const products = {
          id: item.id[0],
          name: parsedXML.items[item.id[0]].name,
          type: parsedXML.types[item.type_id[0]].name,
          weight: item.Item_W[0],
          mrp: item.Item_MRP[0],
        };

        outlets[newOutlet.id].products.push(products);
      });
    });

    await saveData(outlets);
    return true;
  } catch (error) {
    console.log(`Error: ${error}`);
  } finally {
    lock = false;
  }
};

const saveData = async (outlets) => {
  console.log("saving data");
  try {
    for (const [key, outlet] of Object.entries(outlets)) {
      const newOutlet = new outletModel({
        id: outlet.id,
        name: outlet.name,
        size: outlet.size,
        year: outlet.year,
        locationType: outlet.locationType,
        sales: outlet.sales,
        product: outlet.products,
      });
      await newOutlet.save();
    }
    console.log("data saved");
  } catch (error) {
    console.log(error);
  }
};

export { router as migrationRouter };
