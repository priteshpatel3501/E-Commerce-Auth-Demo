const mongoose = require("mongoose");
const admin_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name required.",
    },
    email: {
      type: String,
      index: { unique: [true, "Email already exist."] },
      required: "Email required.",
    },
    password: {
      type: String,
      required: "Passoword required.",
    },
    profile: {
      type: String,
    },
    otp: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Admin", admin_schema);
