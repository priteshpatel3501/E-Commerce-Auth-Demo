const router = require("express").Router();
const multer = require("multer");
const bodyParser = require("body-parser");

// Middelware
router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const destination =
      req.body.type === "user" ? "UserProfile/" : "BookProfile/";
    callback(null, "server/Images/" + destination);
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "." + file.originalname.split(".").pop());
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("display"), (req, res) => {
  if (req.body.type === "") {
    res.send({
      response_code: 1,
      status: 500,
      message: "Image type is required.",
    });
  } else {
    res.send({
      response_code: 0,
      status: 200,
      message: "Image upload successfully.",
      url: req.file.filename,
    });
  }
});
module.exports = router;
