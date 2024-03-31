const { BadRequestError } = require("../core/error.response");
const {
  ProductModel,
  ClothingModel,
  ElectronicsModel,
  FurnitureModel,
} = require("../models/product.model");

class ProductFactory {
  static productRegistry = {}; // store product types

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
    console.log(ProductFactory.productRegistry);
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError("Invalid product type");
    }
    return new productClass(payload).createProduct();
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
  async createProduct(product_id) {
    return await ProductModel.create({ ...this, product_shop: product_id });
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
    const newProduct = await super.createProduct(newClothing._id);
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
    const newProduct = await super.createProduct(newFurniture._id);
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
