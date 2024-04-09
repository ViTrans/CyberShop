const { BadRequestError } = require("../core/error.response");
const {
  ProductModel,
  ClothingModel,
  ElectronicsModel,
  FurnitureModel,
} = require("../models/product.model");

const mongoose = require("mongoose");
const {
  getSelectData,
  removeUndefinedObject,
  updateNestedObject,
} = require("../utils");
const { updateProductById } = require("../models/repositories/product.repo");
const productModel = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");

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

  static async updateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError("Invalid product type");
    }
    return new productClass(payload).updateProduct(product_id);
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

  // find all products
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
    select = ["product_name", "product_thumb", "product_price"],
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await ProductModel.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();
    return products;
  }

  // find product by id
  static async findProductById(product_id) {
    return await ProductModel.findById(product_id).populate(
      "product_shop",
      "name email"
    );
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
    const newProduct = await ProductModel.create({ ...this });
    if (newProduct) {
      // create inventory for product
      await insertInventory({
        product_id: newProduct._id,
        shop_id: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }
  async updateProduct(product_id, payload) {
    return await updateProductById({
      product_id,
      payload,
      model: ProductModel,
    });
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
    const newProduct = await super.createProduct(); // call parent method
    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }
    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: ClothingModel,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );
    return updateProduct;
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
    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }
    return newProduct;
  }
  async updateProduct(product_id) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: ElectronicsModel,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );
    return updateProduct;
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

    console.log("new product", newProduct);
    if (!newProduct) {
      throw new BadRequestError("Cannot create new product");
    }
    return newProduct;
  }

  async updateProduct(product_id) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attributes),
        model: FurnitureModel,
      });
    }
    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObject(objectParams)
    );
    return updateProduct;
  }
}

// register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
