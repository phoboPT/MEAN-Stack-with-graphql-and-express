import mongoose from "mongoose";

const Schema = mongoose.Schema;
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: [1],
    required: true,
  },
  discount: {
    type: Number,
    min: [0],
    required: false,
  },
});
const shopSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  product: {
    type: [productSchema],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now() },
});

const shopModel = mongoose.model("Shop", shopSchema);

export { shopModel };
