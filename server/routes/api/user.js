const router = require("express").Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("../../models/User");
const User = mongoose.model("User");

router.get("/", async (req, res) => {
  const user = await User.find({});
  if (user.length > 0) {
    res.send({
      status: 200,
      response_code: 0,
      message: "Record fetch successfully.",
      response_data: user,
      count: user.length,
    });
  } else {
    res.send({
      status: 404,
      response_code: 0,
      message: "Data not found.",
      response_data: user,
    });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.find({ _id: req.params.id });
  if (user.length > 0) {
    res.send({
      status: 200,
      response_code: 0,
      message: "Record fetch successfully.",
      response_data: user,
      count: user.length,
    });
  } else {
    res.send({
      status: 404,
      response_code: 0,
      message: "Data not found.",
      response_data: user,
    });
  }
});
router.post("/userLogin", async (req, res) => {
  let bodyData = JSON.parse(req.body);
  const user = await User.find({
    email: bodyData.email,
    password: bodyData.password,
  });
  if (user.length > 0) {
    let currentDate = new Date();
    currentDate.setHours(1);
    let token = jwt.sign(
      {
        email: bodyData.email,
      },
      "secret",
      { expiresIn: "1h" }
    );
    res.send({
      status: 200,
      response_code: 0,
      message: "Record fetch successfully.",
      response_data: user[0],
      auth_Token: token,
    });
  } else {
    res.send({
      status: 404,
      response_code: 0,
      message: "Data not found.",
      response_data: [],
      auth_Token: null,
    });
  }
});

router.post("/", async (req, res) => {
  let bodyData = JSON.parse(req.body);
  const user = new User();
  const check_user = await User.find({
    email: bodyData.email,
    login_type: 0,
  });
  if (check_user.length > 0) {
    let data = check_user[0];
    if (data.login_type === 0) {
      res.send({
        status: 400,
        response_code: 1,
        message: "Email already exist.",
        response_data: [],
      });
    } else {
      let userData = {
        name: bodyData.name,
        email: bodyData.email,
        phone: data.phone,
        address: data.address,
        password: data.password,
        login_type: bodyData.login_type,
        profile: bodyData.profile,
        google_id: data.google_id,
        facebook_id: data.facebook_id,
      };
      const user = await User.findByIdAndUpdate({ _id: data._id }, userData, {
        new: true,
        runValidators: true,
      });
      await user.save();
      res.send({
        status: 200,
        response_code: 0,
        message: "Record insert successfully.",
      });
    }
  } else {
    user.name = bodyData.name;
    user.email = bodyData.email;
    user.phone = bodyData.phone ? bodyData.phone : "";
    user.address = bodyData.address ? bodyData.address : "";
    user.password = bodyData.password ? bodyData.password : "";
    user.login_type = bodyData.login_type;
    user.profile = bodyData.profile;
    user.google_id = "";
    user.facebook_id = "";
    await user.save();
    res.send({
      status: 200,
      response_code: 0,
      message: "Record insert successfully.",
      response_data: user,
    });
  }
});

router.post("/signupGoogleFacebbok", async (req, res) => {
  let bodyData = JSON.parse(req.body);

  let currentDate = new Date();
  currentDate.setHours(1);
  let token = jwt.sign(
    {
      email: bodyData.email,
    },
    "secret",
    { expiresIn: "1h" }
  );
  const checkUser = await User.find({
    email: bodyData.email,
  });
  if (checkUser.length > 0) {
    let data = checkUser[0];
    let userData = {
      name: bodyData.name,
      email: bodyData.email,
      phone: bodyData.phone ? bodyData.phone : data.phone,
      address: bodyData.address ? bodyData.address : data.address,
      password: bodyData.password ? bodyData.password : data.password,
      login_type: bodyData.login_type,
      profile: bodyData.profile,
      google_id: bodyData.google_id ? bodyData.google_id : data.google_id,
      facebook_id: bodyData.facebook_id
        ? bodyData.facebook_id
        : data.facebook_id,
    };
    const user = await User.findByIdAndUpdate({ _id: data._id }, userData, {
      new: true,
      runValidators: true,
    });
    await user.save();
    res.send({
      status: 201,
      response_code: 0,
      message: "Record insert successfully.",
      auth_Token: token,
      response_data: user,
    });
  } else {
    const user = new User();
    user.name = bodyData.name;
    user.email = bodyData.email;
    user.phone = "";
    user.address = "";
    user.password = "";
    user.login_type = bodyData.login_type;
    user.google_id = bodyData.login_type === 1 ? bodyData.google_id : "";
    user.facebook_id = bodyData.login_type === 2 ? bodyData.facebook_id : "";
    user.profile = bodyData.profile;
    await user.save();
    res.send({
      status: 201,
      response_code: 0,
      message: "Record insert successfully.",
      response_data: user,
      auth_Token: token,
    });
  }
});

router.put("/:id", async (req, res) => {
  let bodyData = JSON.parse(req.body);
  const user = await User.findByIdAndUpdate({ _id: req.params.id }, bodyData, {
    new: true,
    runValidators: true,
  });

  res.send({
    status: 200,
    response_code: 0,
    message: "Record update successfully.",
    response_data: user,
  });
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove({ _id: req.params.id });
  res.send({
    status: 200,
    response_code: 0,
    message: "Record delete successfully.",
    response_data: user,
  });
});

module.exports = router;
