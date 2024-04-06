const { BadRequestError } = require("../core/error.response");
const {
  ProductModel,
  ClothingModel,
  ElectronicsModel,
  FurnitureModel,
} = require("../models/product.model");

const mongoose = require("mongoose");

class ProductFactory {
  static productRegistry = {}; // store product types

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError("Invalid product type");
    }
    return new productClass(payload).createProduct();
  }

  static async findAllDraftsForShop(
    product_shop,
    { limit = 10, skip = 0 } = {}
  ) {
    return await ProductModel.find({ product_shop, isDraft: true })
      .populate("product_shop", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  static async findAllPublishedForShop(
    product_shop,
    { limit = 10, skip = 0 } = {}
  ) {
    return await ProductModel.find({ product_shop, isPublished: true })
      .populate("product_shop", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
  }

  // publish product by shop
  static async publishProductByShop(product_shop, product_id) {
    console.log("product_shop", product_shop);
    console.log("product_id", product_id);
    const product = await ProductModel.findOne({
      _id: product_id,
      product_shop,
    });
    if (!product) {
      throw new BadRequestError("Product not found");
    }
    product.isDraft = false;
    product.isPublished = true;
    return await product.save();
  }

  // unpublish product by shop
  static async unPublishProductByShop(product_shop, product_id) {
    const product = await ProductModel.findOne({
      _id: product_id,
      product_shop,
    });
    if (!product) {
      throw new BadRequestError("Product not found");
    }
    product.isDraft = true;
    product.isPublished = false;
    return await product.save();
  }

  // search product
  static async searchProduct({ keySearch }) {
    return await ProductModel.find(
      {
        $text: { $search: keySearch },
        isPublished: true,
      },
      {
        score: { $meta: "textScore" },
      }
    ).sort({ score: { $meta: "textScore" } });
  }
}

// define base class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct() {
    return await ProductModel.create({ ...this });
  }
}

// define subclass for different product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Cannot create new clothing product");
    }
    const newProduct = await super.createProduct(newClothing._id); // call parent method
    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }
    return newProduct;
  }
}
// define subclass for different product types electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await ElectronicsModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("Cannot create new Electronics product");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }
    return newProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await FurnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      throw new BadRequestError("Cannot create new Furniture product");
    }
    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }
    return newProduct;
  }
}

// register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
