const mongoose = require("mongoose");
const order_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: "User Id required.",
    },
    order: {
      type: String,
    },
    total: {
      type: String,
    },
    order_date: {
      type: String,
    },
    status: {
      type: Number,
    },
    payment_id: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", order_schema);
