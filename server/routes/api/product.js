const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("../../models/Product");
const Product = mongoose.model("Product");

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
      const product = await Product.find({});
      if (product.length > 0) {
        res.send({
          status: 200,
          response_code: 0,
          message: "Record fetch successfully.",
          response_data: product,
          count: product.length,
        });
      } else {
        res.send({
          status: 404,
          response_code: 0,
          message: "Data not found.",
          response_data: product,
        });
      }
    }
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
      const product = await Product.find({ _id: req.params.id });
      if (product.length > 0) {
        res.send({
          status: 200,
          response_code: 0,
          message: "Record fetch successfully.",
          response_data: product,
          count: product.length,
        });
      } else {
        res.send({
          status: 404,
          response_code: 0,
          message: "Data not found.",
          response_data: product,
        });
      }
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

      const product = new Product();
      product.title = bodyData.title;
      product.price = bodyData.price;
      product.description = bodyData.description;
      product.publish_date = bodyData.publish_date;
      product.profile = bodyData.profile;
      await product.save();

      res.send({
        status: 200,
        response_code: 0,
        message: "Record insert successfully.",
        response_data: product,
      });
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
      const product = await Product.findByIdAndUpdate(
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
        response_data: product,
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
      const product = await Product.findByIdAndRemove({ _id: req.params.id });
      res.send({
        status: 200,
        response_code: 0,
        message: "Record delete successfully.",
        response_data: product,
      });
    }
  });
});

module.exports = router;
