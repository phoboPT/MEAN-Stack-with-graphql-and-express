import express from "express";
import { productModel, userModel } from "../models/model.js";

import jwt from "jsonwebtoken";
const router = express.Router();

router.put("/products", async (req, res) => {
  try {
    const { name, weight, type, mrp, id } = req.body;
    const payload = jwt.verify(req.session.jwt, process.env.SECRET);
    const user = await userModel.findById(payload.id);
    if (!user) {
      return res.status(400).send("User not found");
    }
    if (user.permission !== "admin") {
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
export { router as productRouter };
