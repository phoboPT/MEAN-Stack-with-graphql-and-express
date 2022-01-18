import express from "express";
import { outletModel, productModel, userModel } from "../models/model.js";
import { currentUser } from "../midleware/currentUser.js";
import { requiredAuth } from "../midleware/requiredAuth.js";
const router = express.Router();

router.put("/products", currentUser, requiredAuth, async (req, res) => {
  try {
    const { name, weight, type, mrp, id } = req.body;

    const user = await userModel.findById(req.currentUser.id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    if (user.permission !== "admin" || user.permission !== "edit") {
      return res.status(400).send("You are not authorized to do this");
    }
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(400).send("Product not found");
    }
    product.set({
      name: name || product.name,
      weight: weight || product.weight,
      type: type || product.type,
      mrp: mrp || product.mrp,
      updated_at: Date.now(),
    });
    await product.save();

    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

router.post("/products", currentUser, requiredAuth, async (req, res) => {
  try {
    const { name, weight, type, mrp, id } = req.body;

    const user = await userModel.findById(req.currentUser.id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    if (user.permission === "view") {
      return res.status(400).send("You are not authorized to do this");
    }

    if (!name) {
      return res.status(400).send("Name is required");
    }
    if (!weight) {
      return res.status(400).send("Weight is required");
    }
    if (!type) {
      return res.status(400).send("Type is required");
    }
    if (!mrp) {
      return res.status(400).send("MRP is required");
    }
    if (!id) {
      return res.status(400).send("Id is required");
    }

    const product = new productModel({
      id: id,
      name: name,
      weight: weight,
      type: type,
      mrp: mrp,
    });
    await product.save();

    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

router.delete("/products", currentUser, requiredAuth, async (req, res) => {
  try {
    const { id } = req.body;

    const user = await userModel.findById(req.currentUser.id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    if (user.permission === "view") {
      return res.status(400).send("You are not authorized to do this");
    }
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(400).send("Product not found");
    }
    const outlet = await outletModel.find({ products: id });

    if (outlet) {
      return res.status(400).send("Product is associated with an outlet");
    }

    await product.remove();
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

export { router as productRouter };
