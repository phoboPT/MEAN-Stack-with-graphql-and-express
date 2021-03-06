import express from "express";
import { body } from "express-validator";
import { userModel } from "../models/model.js";
import { Password } from "../lib/password.js";
import jwt from "jsonwebtoken";
import { validateRequest } from "../midleware/validateRequest.js";
const router = express.Router();

router.post(
  "/user",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Provide a password"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return res.status(400).send("User already exist");
      }
      const newUser = new userModel({
        email,
        password,
      });
      await newUser.save();

      res.status(200).send("User created");
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

router.put(
  "/user",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Provide a password"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, permission } = req.body;
      const user = await userModel.findOne({ email });

      if (!user) {
        return res.status(400).send("User not found");
      }
      if (user.permission !== "admin") {
        return res.status(400).send("You are not authorized to do this");
      }
      user.set({ permission, updated_at: Date.now() });
      await user.save();

      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      res.status(500).send(`Something wrong happened: ${error}`);
    }
  }
);

router.delete("/user", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found");
    }
    if (user.permission !== "admin") {
      return res.status(400).send("You are not authorized to do this");
    }
    await user.delete();
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .notEmpty()
      .withMessage("Provide a password"),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const existingUser = await userModel.findOne({ email });
      if (!existingUser) {
        return res.status(401).send("User not found");
      }
      const passwordsMatch = await Password.compare(
        existingUser.password,
        password
      );
      if (!passwordsMatch) {
        return res.status(401).send("Wrong password");
      }

      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        process.env.SECRET
      );

      req.session = { jwt: userJwt };
      res.status(200).send(existingUser);
    } catch (error) {
      console.log(error);
      res.status(500).send(`An error as occured: ${error}`);
    }
  }
);

export { router as userRouter };
