const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("../../models/Book");
const Book = mongoose.model("Book");

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
      const book = await Book.find({});
      if (book.length > 0) {
        res.send({
          status: 200,
          response_code: 0,
          message: "Record fetch successfully.",
          response_data: book,
          count: book.length,
        });
      } else {
        res.send({
          status: 404,
          response_code: 0,
          message: "Data not found.",
          response_data: book,
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
      const book = await Book.find({ _id: req.params.id });
      if (book.length > 0) {
        res.send({
          status: 200,
          response_code: 0,
          message: "Record fetch successfully.",
          response_data: book,
          count: book.length,
        });
      } else {
        res.send({
          status: 404,
          response_code: 0,
          message: "Data not found.",
          response_data: book,
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

      const book = new Book();
      book.title = bodyData.title;
      book.author = bodyData.author;
      book.description = bodyData.description;
      book.publish_date = bodyData.publish_date;
      book.profile = bodyData.profile;
      await book.save();

      res.send({
        status: 200,
        response_code: 0,
        message: "Record insert successfully.",
        response_data: book,
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
      const book = await Book.findByIdAndUpdate(
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
        response_data: book,
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
      const book = await Book.findByIdAndRemove({ _id: req.params.id });
      res.send({
        status: 200,
        response_code: 0,
        message: "Record delete successfully.",
        response_data: book,
      });
    }
  });
});

module.exports = router;
