const mongoose = require("mongoose");
const bookhistory_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: "User Id required.",
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: "Book Id required.",
    },
    issue_date: {
      type: String,
    },
    return_date: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("BookHistory", bookhistory_schema);
