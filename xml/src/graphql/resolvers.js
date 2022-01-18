import { outletModel, productModel } from "../models/model.js";

const graphqlResolver = {
  async outlets() {
    const outlets = await outletModel.find();
    return outlets.map((q) => {
      return {
        ...q._doc,
        products: q.products.map(async (p) => {
          return await productModel.findById(p);
        }),
      };
    });
  },
  async outlet(args) {
    const outlet = await outletModel.findById(args.id);

    return {
      _id: outlet._id,
      id: outlet.id,
      name: outlet.name,
      size: outlet.size,
      products: outlet.products.map(async (p) => {
        return await productModel.findById(p);
      }),
      year: outlet.year,
      locationType: outlet.locationType,
      sales: outlet.sales,
      created_at: outlet.created_at,
      updated_at: outlet.updated_at,
    };
  },
  async product(args) {
    const product = await productModel.findById(args.id);
    return {
      _id: product._id,
      id: product.id,
      name: product.name,
      type: product.type,
      weight: product.weight,
      mrp: product.mrp,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  },
  async products() {
    const product = await productModel.find();

    return product.map((q) => {
      return {
        ...q._doc,
      };
    });
  },
};

export default graphqlResolver;
