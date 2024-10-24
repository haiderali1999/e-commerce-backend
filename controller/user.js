const { validObject, delKeys, hashPassword } = require("../utils/utils");
const UserModel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async function (req, res, next) {
  try {
    const { username, email, password, role } = req.body;

    validObject(req.body, ["username", "email", "password", "role"], res);

    const emailExist = await UserModel.findOne({ email });
    if (emailExist) {
      res.json({ message: "User already exist" });
      return;
    }

    const hash = await hashPassword(password);
    const user = new UserModel({ username, email, password: hash, role });
    await user.save();

    res.send({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.json({ message: "User not created", error: error.message });
  }
};

const login = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    validObject({ email, password }, ["email", "password"], res);
    const result = await UserModel.findOne(
      { email },
      { _id: 1, email: 1, username: 1, password: 1 }
    );
    if (!result) {
      res.json({ message: "User not found" });
      return;
    }
    const user = result.toObject();
    const authUser = { username: user.username, email: user.email };
    const token = jwt.sign(authUser, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(authUser, process.env.REFRESH_TOKEN_SECRET);

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      await UserModel.updateOne({ _id: user._id }, { $push: { refreshToken } });
      const _user = delKeys(user, ["password"]);
      res.json({ user: _user, token, refreshToken });
    } else {
      {
        res.json({ messasge: "Password does not match" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async function (req, res, next) {
  try {
    const users = await UserModel.find({}, { _id: 1, username: 1, email: 1 });
    res.json({ data: users });
  } catch (error) {
    res.json({ message: error?.message });
  }
};

const refreshToken = async (req, res, next) => {
  const { token } = req.body;
  console.log(token);
  if (!token) return res.sendStatus(401);
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  });
  // await UserModel.find()
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await UserModel.findOne({ email: email });

    if (!user) return res.status(404).json({ message: "user not found" });

    user.createResetPassordToken();

    await user.save({ validateBeforeSave: false });
    res.json({ message: "reset token send to your email" });
  } catch (error) {
    res.json({ message: error?.message || "forgot error api issue" });
  }
};

const passwordReset = (req, res, next) => {};

module.exports = {
  signup,
  login,
  getUsers,
  refreshToken,
  forgotPassword,
  passwordReset,
};
