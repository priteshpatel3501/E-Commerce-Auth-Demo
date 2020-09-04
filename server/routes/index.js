const express = require("express");
const app = express();
require("express-async-errors");
const bookRoutes = require("../routes/api/book");
const userRoute = require("../routes/api/user");
const bookHistoryRoutes = require("../routes/api/bookhistory");
const adminRoutes = require("../routes/api/admin");
const emailRoutes = require("../routes/api/email");
const imageRoutes = require("../routes/api/image");
const productRoutes = require("../routes/api/product");
const myCartRoutes = require("../routes/api/mycart");
const paypal = require("../routes/api/paypal");
const orderRoute = require("../routes/api/order");

module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.use("/server", express.static("./server"));
  app.use("/api/handelBook", bookRoutes);
  app.use("/api/handelproduct", productRoutes);
  app.use("/api/handelUploadImage", imageRoutes);
  app.use("/api/handelUser", userRoute);
  app.use("/api/handelBookHistory", bookHistoryRoutes);
  app.use("/api/handelAdmin", adminRoutes);
  app.use("/api/handelForgotPassword", emailRoutes);
  app.use("/api/handelMyCart", myCartRoutes);
  app.use("/api/handelOrder", orderRoute);
  app.use("/api/paypal", paypal);

  // app.use((req, res, next) => {
  //   req.status = 404;
  //   const error = new Error("Routes not found.");
  //   next(error);
  // });

  // app.use((error, req, res, next) => {
  //   res.status(req.status || 500).send({
  //     message: error.message,
  //     request: req,
  //     // stack: error.stack,
  //   });
  //   next(error);
  // });
};
