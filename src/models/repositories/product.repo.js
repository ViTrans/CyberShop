const { ProductModel } = require("../product.model");

const updateProductById = async ({
  product_id,
  payload,
  model,
  isNew = true,
}) => {
  return await ProductModel.findByIdAndUpdate(
    product_id,
    { ...payload },
    {
      new: isNew,
    }
  );
};

module.exports = {
  updateProductById,
};
