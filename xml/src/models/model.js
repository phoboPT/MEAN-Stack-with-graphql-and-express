import mongoose from "mongoose";
import { v1 } from "uuid";
import { Password } from "../lib/password.js";
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    _id: { type: String, default: v1 },
    id: { type: String, required: true },
    name: {
      type: String,
      required: true,
    },
    type: { type: String, required: true },
    weight: { type: String, required: true },
    mrp: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);
const productModel = mongoose.model("Product", productSchema);

const outletSchema = new Schema(
  {
    _id: { type: String, default: v1 },
    id: { type: String },
    name: {
      type: String,
      required: true,
    },
    size: { type: String, required: true },
    products: [
      {
        type: String,
        ref: "Product",
      },
    ],
    year: { type: String, required: true },
    locationType: { type: String, required: true },
    sales: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);
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
    permission: { type: String, default: "view", required: true },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
  },
  {
    toJSON: {
      transform(doc, ret) {
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
user.statics.build = (attrs) => new userModel(attrs);
const userModel = mongoose.model("User", user);

export { outletModel, productModel, userModel };
