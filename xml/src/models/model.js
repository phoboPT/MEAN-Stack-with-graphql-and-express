import mongoose from "mongoose";
import { v1 } from "uuid";
import { Password } from "../lib/password.js";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  _id: { type: String, default: v1 },
  id: { type: String, required: true },
  name: {
    type: String,
  },

  type: { type: String },
  weight: { type: String },
  mrp: { type: String },
});
const productModel = mongoose.model("Product", productSchema);

const outletSchema = new Schema({
  _id: { type: String, default: v1 },
  id: { type: String },
  name: {
    type: String,
  },
  size: { type: String },
  products: [
    {
      type: String,
      ref: "Product",
    },
  ],
  year: { type: String },
  locationType: { type: String },
  sales: { type: String },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});
const outletModel = mongoose.model("Outlet", outletSchema);

const user = new Schema(
  {
    _id: { type: String, default: v1 },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    permission: { type: String, default: "view" },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

user.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
const userModel = mongoose.model("User", user);

export { outletModel, productModel, userModel };
