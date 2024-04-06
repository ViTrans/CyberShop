const mongoose = require("mongoose");

var keyTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Shops",
  },
  publicKey: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  refreshTokensUsed: {
    // refreshToken dang duoc su dung
    type: Array,
    default: [],
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Keys", keyTokenSchema);
