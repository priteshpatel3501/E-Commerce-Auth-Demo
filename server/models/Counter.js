const mongoose = require("mongoose");
const book_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: "title required.",
    },
    author: {
      type: String,
      required: "author name required.",
    },
    description: {
      type: String,
      required: "Mobile required.",
    },
    publish_date: {
      type: String,
      required: "City required.",
    },
    profile: {
      type: String,
      required: "Profile image required.",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Book", book_schema);
