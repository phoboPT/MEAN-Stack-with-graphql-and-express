import { shopModel } from "../models/model.js";

const graphqlResolver = {
  async createShop({ productInput, product }) {
    const shop = new shopModel({
      name: productInput.name,
      description: productInput.description,
      product: product,
    });
    const createdProduct = await shop.save();
    return {
      ...createdProduct._doc,
      _id: createdProduct._id.toString(),
    };
  },

  async shops() {
    const products = await shopModel.find();
    return {
      shop: products.map((q) => {
        return {
          ...q._doc,
          _id: q._id.toString(),
        };
      }),
    };
  },

  async updateProduct({ id, productInput }) {
    const product = await model.findById(id);
    if (!product) {
      throw new Error("Product Not found!");
    }
    product.name = productInput.name;
    product.description = productInput.description;
    product.price = productInput.price;
    product.discount = productInput.discount;

    const updatedProduct = await product.save();
    return {
      ...updatedProduct._doc,
      _id: updatedProduct._id.toString(),
    };
  },

  async deleteProduct({ id, productInput }) {
    const product = await model.findById(id);
    if (!product) {
      throw new Error("Product Not found!");
    }
    await model.findByIdAndRemove(id);
    return {
      ...product._doc,
      _id: product._id.toString(),
    };
  },
};

export default graphqlResolver;
