import express from "express";
import { outletModel, productModel, userModel } from "../models/model.js";
import { currentUser } from "../midleware/currentUser.js";
import { requiredAuth } from "../midleware/requiredAuth.js";
import { validateRequest } from "../midleware/validateRequest.js";
import { body } from "express-validator";
const router = express.Router();

router.put(
  "/products",
  [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a id"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
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
  }
);

router.post(
  "/products",
  [
    body("name")
      .trim()
      .isLength({ min: 4 })
      .notEmpty()
      .withMessage("Provide a name"),
    body("wight")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a weight"),
    body("type")
      .trim()
      .isLength({ min: 2 })
      .notEmpty()
      .withMessage("Provide a type"),
    body("mrp")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a mrp"),
    body("id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a id"),
  ],
  validateRequest,
  currentUser,
  requiredAuth,
  async (req, res) => {
    try {
      const { name, weight, type, mrp, id } = req.body;

      const user = await userModel.findById(req.currentUser.id);
      if (!user) {
        return res.status(400).send("User not found");
      }
      if (user.permission === "view") {
        return res.status(400).send("You are not authorized to do this");
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
  }
);

router.delete(
  "/products",
  [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .notEmpty()
      .withMessage("Provide a id"),
  ],
  validateRequest,
  requiredAuth,
  async (req, res) => {
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
  }
);

export { router as productRouter };
