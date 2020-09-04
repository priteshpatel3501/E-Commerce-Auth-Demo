const mongoose = require("mongoose");
const cart_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: "User Id required.",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: "Product Id required.",
    },
    quantity: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("MyCart", cart_schema);
