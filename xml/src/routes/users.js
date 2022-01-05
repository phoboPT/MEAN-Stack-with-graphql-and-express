import express from "express";
import { userModel } from "../models/model.js";
import { Password } from "../lib/password.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/user", async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new userModel({
      email,
      password,
    });
    newUser.save();

    res.status(200).send("User created");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something wrong happened: ${error}`);
  }
});
router.get("/me", async (req, res) => {
  try {
    const payload = jwt.verify(req.session.jwt, process.env.SECRET);
    console.log(payload);
    res.status(200).send(payload);
  } catch (error) {
    console.log(error);
    res.status(500).send(`An error as occured: ${error}`);
  }
});
router.post("/login", async (req, res) => {
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
        rating: existingUser.rating,
      },
      process.env.SECRET
    );

    req.session = { jwt: userJwt };
  } catch (error) {
    console.log(error);
    res.status(500).send(`An error as occured: ${error}`);
  }

  res.status(200).send(existingUser);
});

export { router as userRouter };
