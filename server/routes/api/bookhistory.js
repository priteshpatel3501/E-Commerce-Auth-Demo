const router = require("express").Router();
const mongoose = require("mongoose");

require("../../models/BookHistory");
require("../../models/User");
const BookHistory = mongoose.model("BookHistory");

router.get("/", async (req, res) => {
  const bookHistory = await BookHistory.find({})
    .select("_id issue_date return_date createdAt updatedAt")
    .populate("user_id book_id", "name phone profile title");
  if (bookHistory.length > 0) {
    res.send({
      status: 200,
      response_code: 0,
      message: "Record fetch successfully.",
      response_data: bookHistory,
      count: bookHistory.length,
    });
  } else {
    res.send({
      status: 404,
      response_code: 0,
      message: "Data not found.",
      response_data: bookHistory,
    });
  }
});

router.post("/page", async (req, res) => {
  let bodyData = JSON.parse(req.body);

  let textSearch = new RegExp(bodyData.searchText);
  const bookHistory = await BookHistory.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "User",
      },
    },
    { $unwind: "$User" },
    {
      $lookup: {
        from: "books",
        localField: "book_id",
        foreignField: "_id",
        as: "Book",
      },
    },
    { $unwind: "$Book" },
    {
      $match:
        bodyData.searchText === ""
          ? {}
          : {
              $or: [
                {
                  "User.name": { $regex: textSearch, $options: "mi" },
                },
                {
                  "Book.title": { $regex: textSearch, $options: "mi" },
                },
              ],
            },
    },
    {
      $project: {
        user_name: "$User.name",
        user_profile: "$User.profile",
        user_id: "$User._id",
        book_id: "$Book._id",
        book_title: "$Book.title",
        book_profile: "$Book.profile",
        issue_date: 1,
        return_date: 1,
      },
    },
  ])
    .skip(bodyData.skip)
    .limit(bodyData.limit);
  // .sort({ issue_date: -1 });

  const totalRow = await BookHistory.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "User",
      },
    },
    { $unwind: "$User" },
    {
      $lookup: {
        from: "books",
        localField: "book_id",
        foreignField: "_id",
        as: "Book",
      },
    },
    { $unwind: "$Book" },
    {
      $match:
        bodyData.searchText === ""
          ? {}
          : {
              $or: [
                {
                  "User.name": { $regex: textSearch, $options: "mi" },
                },
                {
                  "Book.title": { $regex: textSearch, $options: "mi" },
                },
              ],
            },
    },
    {
      $project: {
        user_name: "$User.name",
        user_profile: "$User.profile",
        user_id: "$User._id",
        book_id: "$Book._id",
        book_title: "$Book.title",
        book_profile: "$Book.profile",
        issue_date: 1,
        return_date: 1,
      },
    },
  ]);

  res.send({
    status: 200,
    response_code: 0,
    message: "Record fetch successfully.",
    response_data: bookHistory,
    count: totalRow.length,
  });
});

router.get("/:id", async (req, res) => {
  const bookHistory = await BookHistory.findOne({ _id: req.params.id })
    .select("_id issue_date return_date createdAt updatedAt")
    .populate("user_id book_id", "name phone profile title");
  if (bookHistory.length > 0) {
    res.send({
      status: 200,
      response_code: 0,
      message: "Record fetch successfully.",
      response_data: bookHistory,
    });
  } else {
    res.send({
      status: 404,
      response_code: 0,
      message: "Data not found.",
      response_data: bookHistory,
    });
  }
});

router.post("/", async (req, res) => {
  let bodyData = JSON.parse(req.body);

  const bookHistory = new BookHistory();
  bookHistory.user_id = bodyData.user_id;
  bookHistory.book_id = bodyData.book_id;
  bookHistory.issue_date = bodyData.issue_date;
  bookHistory.return_date = bodyData.return_date;
  await bookHistory.save();

  res.send({
    status: 200,
    response_code: 0,
    message: "Record insert successfully.",
    response_data: bookHistory,
  });
});

router.put("/:id", async (req, res) => {
  let bodyData = JSON.parse(req.body);
  const bookHistory = await BookHistory.findByIdAndUpdate(
    { _id: req.params.id },
    bodyData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.send({
    status: 200,
    response_code: 0,
    message: "Record update successfully.",
    response_data: bookHistory,
  });
});

router.delete("/:id", async (req, res) => {
  const bookHistory = await BookHistory.findByIdAndRemove({
    _id: req.params.id,
  });
  res.send({
    status: 200,
    response_code: 0,
    message: "Record delete successfully.",
    response_data: bookHistory,
  });
});

module.exports = router;
