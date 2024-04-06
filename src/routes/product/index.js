const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// search product
router.get(
  "/product/search/:keySearch",
  asyncHandler(productController.searchProduct)
);

router.use(authentication);

router.post("/product", asyncHandler(productController.createProduct));
// publish
router.put(
  "/product/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
// unpublish
router.put(
  "/product/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);
// query
router.get("/product/drafts", asyncHandler(productController.getDrafts));
router.get("/product/published", asyncHandler(productController.getPublished));

module.exports = router;
