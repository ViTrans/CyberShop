const mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_thumb: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
  },
  product_type: {
    type: String,
    required: true,
    enum: ["Electronics", "Clothing", "Books", "Furniture", "Others"],
  },
  product_shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  product_attributes: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const clothingSchema = new mongoose.Schema(
  {
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
      enum: ["S", "M", "L", "XL", "XXL"],
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ElectronicSchema = new mongoose.Schema(
  {
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    manufactuer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const furnitureSchema = new mongoose.Schema(
  {
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    size: {
      // small, medium, large
      type: String,
      required: true,
    },
    material: {
      // wood, plastic, metal
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = {
  ProductModel: mongoose.model("Products", productSchema),
  ClothingModel: mongoose.model("Clothing", clothingSchema),
  ElectronicsModel: mongoose.model("Electronics", ElectronicSchema),
  FurnitureModel: mongoose.model("Furniture", furnitureSchema),
};
