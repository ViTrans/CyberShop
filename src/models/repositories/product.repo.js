const { ProductModel } = require("../product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await ProductModel.find(query)
    .populate("product_shop")
    .limit(limit)
    .skip(skip);
};

module.exports = {
  findAllDraftsForShop,
};
