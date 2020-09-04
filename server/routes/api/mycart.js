const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("../../models/MyCart");
const MyCart = mongoose.model("MyCart");

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
      const myCart = await MyCart.aggregate([
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
            from: "products",
            localField: "product_id",
            foreignField: "_id",
            as: "Product",
          },
        },
        { $unwind: "$Product" },
        {
          $match: {
            user_id: { $eq: new ObjectId(`${req.params.id}`) },
          },
        },
        {
          $project: {
            _id: "$_id",
            quantity: "$quantity",
            user_name: "$User.name",
            user_profile: "$User.profile",
            user_id: "$User._id",
            login_type: "$User.login_type",
            product_id: "$Product._id",
            product_title: "$Product.title",
            product_price: "$Product.price",
            product_profile: "$Product.profile",
            issue_date: 1,
            return_date: 1,
          },
        },
      ]);
      res.send({
        status: 200,
        response_code: 0,
        message: "Record fetch successfully.",
        response_data: myCart,
      });
    }
  });
});

router.post("/", async (req, res) => {
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
      const CheckMyCart = await MyCart.find({
        user_id: bodyData.user_id,
        product_id: bodyData.product_id,
      });
      if (CheckMyCart.length > 0) {
        let data = CheckMyCart[0];
        newQuantity = data.quantity + 1;
        data.quantity = newQuantity;
        const myCart = await MyCart.findByIdAndUpdate({ _id: data._id }, data, {
          new: true,
          runValidators: true,
        });
        res.send({
          status: 200,
          response_code: 0,
          message: "Record insert successfully.",
          response_data: myCart,
        });
      } else {
        const myCart = new MyCart();
        myCart.user_id = bodyData.user_id;
        myCart.product_id = bodyData.product_id;
        myCart.quantity = bodyData.quantity;
        await myCart.save();
        res.send({
          status: 200,
          response_code: 0,
          message: "Record insert successfully.",
          response_data: myCart,
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
      const myCart = await MyCart.findByIdAndUpdate(
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
        response_data: myCart,
      });
    }
  });
});

router.delete("/:id", async (req, res) => {
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
      const myCart = await MyCart.findByIdAndRemove({ _id: req.params.id });
      res.send({
        status: 200,
        response_code: 0,
        message: "Record delete successfully.",
        response_data: myCart,
      });
    }
  });
});

router.delete("/destroy/:id", async (req, res) => {
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
      const myCart = await MyCart.deleteMany({
        user_id: { $eq: new ObjectId(`${req.params.id}`) },
      });
      res.send({
        status: 200,
        response_code: 0,
        message: "Record delete successfully.",
        response_data: myCart,
      });
    }
  });
});

module.exports = router;
