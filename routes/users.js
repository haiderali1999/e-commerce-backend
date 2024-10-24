var express = require("express");
var router = express.Router();
const {
  signup,
  login,
  getUsers,
  refreshToken,
  forgotPassword,
  passwordReset,
} = require("../controller/user");

/* GET users listing. */
router.get("/", getUsers);

/* post user. */
router.post("/signup", signup);

router.post("/login", login);

router.post("/token", refreshToken);

router.post("/forgot", forgotPassword);

router.post("/reset", passwordReset);

module.exports = router;
