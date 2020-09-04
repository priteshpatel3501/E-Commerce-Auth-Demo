const router = require("express").Router();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("../../models/Admin");
const Admin = mongoose.model("Admin");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "yamahafz3501@gmail.com",
    pass: "yamahafz3501",
  },
});

router.post("/", async (req, res) => {
  //   let bodyData = req.body;
  let bodyData = JSON.parse(req.body);
  const admin = await Admin.findOne({ email: bodyData.email });
  if (admin) {
    var randomOTP = Math.floor(1000 + Math.random() * 9000);
    admin.otp = randomOTP;
    await admin.save();

    let mailOption = {
      from: "yamahafz3501@gmail.com",
      to: admin.email,
      subject: "Forgot password.",
      text: `Your OTP is ${randomOTP}`,
    };
    transporter.sendMail(mailOption, function (err, info) {
      if (err) {
        res.send({
          status: 200,
          response_code: 0,
          message: "Email send fail.",
          error: err,
        });
      } else {
        res.send({
          status: 200,
          response_code: 0,
          message: "Email send successfully.",
        });
      }
    });
  } else {
    res.send({
      status: 404,
      response_code: 0,
      message: "Email not found.",
    });
  }
});

module.exports = router;
