import { outletModel, productModel } from "../models/model.js";

const graphqlResolver = {
  async createOutlet({ productInput: outletInput, product }) {
    // const outlet = new outletModel({
    //   id: "0",
    //   name: "OUT046",
    //   size: "Small",
    //   year: "2004",
    //   locationType: "Tier 2",
    //   sales: "2689.46",
    //   product: [],
    // });
    const createdProduct = await outlet.save();
    console.log(createdProduct);
    return {
      ...createdProduct._doc,
      _id: createdProduct._id.toString(),
    };
  },

  async outlets() {
    const products = await outletModel.find();
    return {
      outlet: products.map((q) => {
        return {
          ...q._doc,
          _id: q._id.toString(),
          products: q.products.map(async (p) => {
            return await productModel.findById(p);
          }, []),
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
