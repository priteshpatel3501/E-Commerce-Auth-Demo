const router = require("express").Router();
const mongoose = require("mongoose");
var paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "ASufQl4CYYg3QAv1FRq1JSVPPbb-pKqsmaiLfXQF4kMN4N5R0O8JVxpRAmn2UBC3r95f08L6rUABv0cl",
  client_secret:
    "ELMt6z9FFdb-7VcPAH1Drnkm9acMzyIEC5StowUmnJpmLE4xLa9xGExbCjyE0tp1OBqqS8XQuwDCK4EL",
});
const jwt = require("jsonwebtoken");

require("../../models/Order");
const Order = mongoose.model("Order");
require("../../models/MyCart");
const MyCart = mongoose.model("MyCart");

router.post("/pay", async (req, res) => {
  let bodyData = JSON.parse(req.body);
  const total = parseInt(bodyData.total);
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:8000/payment/success",
      cancel_url: "http://localhost:8000/payment/fail",
    },
    transactions: [
      {
        item_list: {},
        amount: {
          currency: "INR",
          total: `${total.toFixed(2)}`,
        },
        description: "This is the payment description E commerce.",
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      res.send({ status: 404, url: "", err: error });
    } else {
      payment.links &&
        payment.links.map((value, index) => {
          if (value.rel === "approval_url") {
            res.send({ status: 200, url: value.href });
          }
        });
    }
  });
});
router.post("/success", async (req, res) => {
  let bodyData = JSON.parse(req.body);
  const payerId = bodyData.payerId;
  const paymentId = bodyData.paymentId;
  const user_id = bodyData.user_id;
  const order_data = bodyData.order_data;
  const order_date = bodyData.order_date;
  const total = parseInt(bodyData.total);

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "INR",
          total: `${total.toFixed(2)}`,
        },
      },
    ],
  };
  paypal.payment.execute(paymentId, execute_payment_json, async function (
    error,
    payment
  ) {
    if (error) {
      console.log(error.response);
    } else {
      const order = new Order();
      order.user_id = user_id;
      order.order = order_data;
      order.total = `${total.toFixed(2)}`;
      order.order_date = order_date;
      order.status = 0;
      order.payment_id = paymentId;
      await order.save();

      var ObjectId = mongoose.Types.ObjectId;
      const myCart = await MyCart.deleteMany({
        user_id: { $eq: new ObjectId(`${user_id}`) },
      });
      res.send({
        status: 200,
        data: [],
      });
    }
  });
});
module.exports = router;
