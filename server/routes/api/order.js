const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("../../models/Order");
const Order = mongoose.model("Order");

router.get("/", async (req, res) => {
  jwt.verify(req.headers.authorization, "secret", async function (
    err,
    decoded
  ) {
    if (err) {
      res.send({
        status: 401,
        response_code: 0,
        message: "Token expired.",
      });
    } else {
      const order = await Order.aggregate([
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
          $project: {
            _id: "$_id",
            total: "$total",
            status: "$status",
            order_date: "$order_date",
            payment_id: "$payment_id",
            user_name: "$User.name",
            user_profile: "$User.profile",
            user_id: "$User._id",
            login_type: "$User.login_type",
          },
        },
      ]);
      if (order.length > 0) {
        res.send({
          status: 200,
          response_code: 0,
          message: "Record fetch successfully.",
          response_data: order,
          count: order.length,
        });
      } else {
        res.send({
          status: 404,
          response_code: 0,
          message: "Data not found.",
          response_data: order,
        });
      }
    }
  });
});

router.post("/", async (req, res) => {
  let bodyData = JSON.parse(req.body);

  let textSearch = new RegExp(bodyData.searchText);
  const order = await Order.aggregate([
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
      $match:
        bodyData.searchText === ""
          ? {}
          : {
              $or: [
                {
                  "User.name": { $regex: textSearch, $options: "mi" },
                },
                {
                  payment_id: { $regex: textSearch, $options: "mi" },
                },
              ],
            },
    },
    {
      $project: {
        _id: "$_id",
        total: "$total",
        status: "$status",
        order_date: "$order_date",
        payment_id: "$payment_id",
        user_name: "$User.name",
        user_profile: "$User.profile",
        user_id: "$User._id",
        login_type: "$User.login_type",
      },
    },
    { $sort: { [bodyData.type]: bodyData.order } },
  ])
    .skip(bodyData.skip)
    .limit(bodyData.limit);

  const order2 = await Order.aggregate([
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
      $match:
        bodyData.searchText === ""
          ? {}
          : {
              $or: [
                {
                  "User.name": { $regex: textSearch, $options: "mi" },
                },
                {
                  payment_id: { $regex: textSearch, $options: "mi" },
                },
              ],
            },
    },
    {
      $project: {
        _id: "$_id",
        total: "$total",
        status: "$status",
        order_date: "$order_date",
        payment_id: "$payment_id",
        user_name: "$User.name",
        user_profile: "$User.profile",
        user_id: "$User._id",
        login_type: "$User.login_type",
      },
    },
  ]);

  res.send({
    status: 200,
    response_code: 0,
    message: "Record fetch successfully.",
    response_data: order,
    count: order2.length,
  });
});

router.get("/:id", async (req, res) => {
  jwt.verify(req.headers.authorization, "secret", async function (
    err,
    decoded
  ) {
    if (err) {
      res.send({
        status: 401,
        response_code: 0,
        message: "Token expired.",
      });
    } else {
      var ObjectId = mongoose.Types.ObjectId;
      const order = await Order.aggregate([
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
          $match: {
            user_id: { $eq: new ObjectId(`${req.params.id}`) },
          },
        },
        {
          $project: {
            _id: "$_id",
            total: "$total",
            status: "$status",
            order_date: "$order_date",
            payment_id: "$payment_id",
            user_name: "$User.name",
            user_profile: "$User.profile",
            user_id: "$User._id",
            login_type: "$User.login_type",
            product_id: "$Product._id",
            issue_date: 1,
            return_date: 1,
          },
        },
      ]);
      if (order.length > 0) {
        res.send({
          status: 200,
          response_code: 0,
          message: "Record fetch successfully.",
          response_data: order,
          count: order.length,
        });
      } else {
        res.send({
          status: 404,
          response_code: 0,
          message: "Data not found.",
          response_data: order,
        });
      }
    }
  });
});

router.put("/:id", async (req, res) => {
  jwt.verify(req.headers.authorization, "secret", async function (
    err,
    decoded
  ) {
    if (err) {
      res.send({
        status: 401,
        response_code: 0,
        message: "Token expired.",
      });
    } else {
      let bodyData = JSON.parse(req.body);
      const order = await Order.findByIdAndUpdate(
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
        response_data: order,
      });
    }
  });
});

module.exports = router;
