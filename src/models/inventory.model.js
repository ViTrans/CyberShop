const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema({
  inven_productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
  },
  inven_location: {
    type: String,
    default: "unknown location",
  },
  inven_stock: {
    type: Number,
    required: true,
  },
  inven_shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shops",
  },
  inven_reservations: {
    type: Array,
    default: [],
  },
});

//Export the model
module.exports = mongoose.model("Inventories", inventorySchema);
