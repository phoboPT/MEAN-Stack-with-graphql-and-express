import mongoose from "mongoose";
import { v1 } from "uuid";
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
const outletSchema = new Schema({
  _id: { type: String, default: v1 },
  id: { type: String },
  name: {
    type: String,
  },
  size: { type: String },
  product: {
    type: [productSchema],
  },
  year: { type: String },
  locationType: { type: String },
  sales: { type: String },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

const outletModel = mongoose.model("Outlet", outletSchema);

export { outletModel };
