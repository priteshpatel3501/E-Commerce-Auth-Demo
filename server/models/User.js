const mongoose = require("mongoose");
const user_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name required.",
    },
    email: {
      type: String,
      required: "Email required.",
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
    },
    login_type: {
      type: Number,
    },
    google_id: {
      type: String,
    },
    facebook_id: {
      type: String,
    },
    profile: {
      type: String,
      required: "Profile image required.",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", user_schema);
