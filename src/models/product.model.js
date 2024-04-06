const mongoose = require("mongoose");
const slugify = require("slugify");

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
  product_slug: {
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
    ref: "Shops",
  },
  product_attributes: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  product_ratingAvg: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must not be more than 5"],
    set: (v) => Math.round(v * 10) / 10,
  },
  product_variants: {
    type: Array,
    default: [],
  },
  isDraft: {
    type: Boolean,
    default: true,
    index: true,
    select: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true,
    select: false,
  },
});
// create index for search
productSchema.index({ product_name: "text", product_description: "text" });

// Create a slug for the product
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const clothingSchema = new mongoose.Schema(
  {
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shops",
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
      ref: "Shops",
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
      ref: "Shops",
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
