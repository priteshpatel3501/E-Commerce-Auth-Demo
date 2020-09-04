const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
// const bodyParser = require("body-parser");
// const { check, validationResult } = require("express-validator");

// var urlencodedParser = bodyParser.urlencoded({ extended: false });

require("../../models/Admin");
const Admin = mongoose.model("Admin");

router.post(
  "/Signin",
  // urlencodedParser,
  // [
  //   check("email")
  //     .isLength({ min: 1 })
  //     .withMessage("Email field is required.")
  //     .isEmail()
  //     .withMessage("Invalid email address."),
  //   check("password")
  //     .isLength({ min: 1 })
  //     .withMessage("Password field is required."),
  //   check("dates").custom((value) => {
  //     var dates = JSON.stringify(value);
  //     var convertDate = JSON.parse(dates);
  //     let oldDate = convertDate.date1 ? new Date(convertDate.date1) : null;
  //     let newDate = convertDate.date2 ? new Date(convertDate.date2) : null;
  //     if (newDate && oldDate) {
  //       if (oldDate > newDate) {
  //         throw new Error("End date must be greater than start date.");
  //       } else {
  //         return true;
  //       }
  //     } else {
  //       if (!newDate) {
  //         throw new Error("End date required.");
  //       } else {
  //         throw new Error("Start date required.");
  //       }
  //     }
  //   }),
  // ],
  async (req, res) => {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   res.send({
    //     success: 401,
    //     error: errors.mapped(),
    //     data: req.body,
    //   });
    // } else {
    //   res.send({
    //     success: 200,
    //     error: errors.mapped(),
    //     data: req.body,
    //   });
    // }

    let bodyData = JSON.parse(req.body);

    const admin = await Admin.find({
      email: bodyData.email,
      password: bodyData.password,
    });
    if (admin.length === 0) {
      res.send({
        status: 404,
        response_code: 0,
        message: "Sign-in failed.",
        response_data: [],
      });
    } else if (admin.length > 0) {
      let currentDate = new Date();
      currentDate.setHours(1);
      let token = jwt.sign(
        {
          email: bodyData.email,
        },
        "secret",
        { expiresIn: "1h" }
      );

      let responseData = {};
      responseData.name = admin[0].name;
      responseData._id = admin[0]._id;
      responseData.profile = admin[0].profile;
      responseData.email = admin[0].email;
      responseData.auth_Token = token;
      responseData.type = "admin";
      res.send({
        status: 200,
        response_code: 0,
        message: "Sign-in successfully.",
        response_data: responseData,
      });
    } else {
      res.send({
        status: 500,
        response_code: 0,
        message: "Sign-in failed.",
        response_data: admin,
      });
    }
  }
);

router.post("/", async (req, res) => {
  let bodyData = JSON.parse(req.body);

  const admin = new Admin();
  admin.name = bodyData.name;
  admin.email = bodyData.email;
  admin.password = bodyData.password;
  admin.profile = bodyData.profile ? bodyData.profile : null;
  await admin.save();

  res.send({
    status: 200,
    response_code: 0,
    message: "Admin signup successfully.",
    response_data: admin,
  });
});

router.post("/changePassword", async (req, res) => {
  let bodyData = JSON.parse(req.body);
  const admin = await Admin.findOne({ email: bodyData.email });

  if (admin) {
    if (admin.otp !== bodyData.otp) {
      res.send({
        status: 202,
        response_code: 0,
        message: "OTP not matched.",
      });
    } else {
      var randomOTP = Math.floor(1000 + Math.random() * 9000);
      admin.otp = randomOTP;
      admin.password = bodyData.password;
      await admin.save();
      res.send({
        status: 200,
        response_code: 0,
        message: "Password change successfully.",
      });
    }
  } else {
    res.send({
      status: 404,
      response_code: 0,
      message: "Email not found.",
    });
  }
});

module.exports = router;
