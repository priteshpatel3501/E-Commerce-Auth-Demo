const mongoose = require("mongoose");
const product_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "Title required.",
    },
    price: {
      type: String,
      required: "Product price required.",
    },
    description: {
      type: String,
      required: "Description required.",
    },
    publish_date: {
      type: String,
      required: "Date required.",
    },
    profile: {
      type: String,
      required: "Profile image required.",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", product_schema);
