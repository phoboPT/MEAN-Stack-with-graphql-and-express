import express from "express";
import { outletModel, productModel, userModel } from "../models/model.js";

import jwt from "jsonwebtoken";
const router = express.Router();

router.get("/outlets", async (req, res) => {
  try {
    const payload = jwt.verify(req.session.jwt, process.env.SECRET);
    const user = await userModel.findById(payload.id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

router.get("/outlets/:id/products", async (req, res) => {
  try {
    //   const payload = jwt.verify(req.session.jwt, process.env.SECRET);
    //   const user = await userModel.findById(payload.id);
    //   if (!user) {
    //     return res.status(400).send("User not found");
    //   }
    const { id } = req.params;
    const products = await outletModel.findById(id);
    console.log(products);
    const final = [];

    for await (let productId of products.products) {
      const product = await productModel.findById(productId);
      final.push(product);
    }

    res.status(200).send(final);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

router.put("/outlets", async (req, res) => {
  try {
    const { name, size, year, locationType, id } = req.body;
    const payload = jwt.verify(req.session.jwt, process.env.SECRET);
    const user = await userModel.findById(payload.id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    if (user.permission !== "admin") {
      return res.status(400).send("You are not authorized to do this");
    }

    const outlet = await outletModel.findById(id);
    if (!outlet) {
      return res.status(400).send("Outlet not found");
    }

    outlet.set({
      name: name || outlet.name,
      size: size || outlet.size,
      year: year || outlet.year,
      locationType: locationType || outlet.locationType,
      updated_at: Date.now(),
    });
    await outlet.save();

    res.status(200).send(outlet);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

router.post("/outlets", async (req, res) => {
  try {
    const { name, size, year, locationType, sales } = req.body;
    if (!name) {
      return res.status(400).send("Missing name in fields");
    }

    if (!size) {
      return res.status(400).send("Missing size in fields");
    }
    if (!year) {
      return res.status(400).send("Missing year in fields");
    }
    if (!locationType) {
      return res.status(400).send("Missing locationType in fields");
    }
    if (!sales) {
      return res.status(400).send("Missing sales in fields");
    }

    const payload = jwt.verify(req.session.jwt, process.env.SECRET);
    const user = await userModel.findById(payload.id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    if (user.permission !== "admin") {
      return res.status(400).send("You are not authorized to do this");
    }

    const outlet = new outletModel({
      name: name,
      size: size,
      year: year,
      locationType: locationType,
      sales: sales,
      product: [],
    });
    await outlet.save();

    res.status(200).send(outlet);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

router.delete("/outlets", async (req, res) => {
  try {
    const { id } = req.body;

    const payload = jwt.verify(req.session.jwt, process.env.SECRET);
    const user = await userModel.findById(payload.id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    if (user.permission !== "admin") {
      return res.status(400).send("You are not authorized to do this");
    }

    const outlet = await outletModel.findById(id);
    if (!outlet) {
      return res.status(400).send("Outlet not found");
    }
    await outlet.delete();

    res.status(200).send(outlet);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

export { router as outletRouter };
