const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
  createProduct = async (req, res, next) => {
    console.log("req userId", req.user.userId);
    new SuccessResponse({
      message: "Product created",
      metaData: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // query
  /**
   * @desc Get all drafts for a shop
   * @param {String} product_shop - shop id
   * @param {Number} limit - limit of drafts
   * @param {Number} skip - skip drafts
   */
  getDrafts = async (req, res, next) => {
    new SuccessResponse({
      message: "Drafts retrieved",
      metaData: await ProductService.findAllDraftsForShop(req.user.userId, {
        limit: 50,
        skip: 0,
      }),
    }).send(res);
  };

  getPublished = async (req, res, next) => {
    new SuccessResponse({
      message: "Published products retrieved",
      metaData: await ProductService.findAllPublishedForShop(req.user.userId, {
        limit: 50,
        skip: 0,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product published",
      metaData: await ProductService.publishProductByShop(
        req.user.userId,
        req.params.id
      ),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product unpublished",
      metaData: await ProductService.unPublishProductByShop(
        req.user.userId,
        req.params.id
      ),
    }).send(res);
  };

  // search Product
  searchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product search result",
      metaData: await ProductService.searchProduct(req.params),
    }).send(res);
  };
}

module.exports = new ProductController();
