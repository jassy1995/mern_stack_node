const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const keys = process.env.OTP;
const registerValidator = require("../validator/user/register-validator");
const loginValidator = require("../validator/user/login-validator");

exports.createUser = async (req, res, next) => {
  const { error, value } = registerValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  req.body.role = req.body.role ? "admin" : "user";
  const randomString = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, randomString);
  let user = await User.create(req.body);
  return res.json(user);
};

exports.loginUser = async (req, res, next) => {
  const { error, value } = loginValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const is_userExist = await User.findOne({ email: req.body.email });
  if (!is_userExist) {
    return res.json({ message: "email does not found" });
  }
  let verifyPassword = await bcrypt.compare(
    req.body.password,
    is_userExist.password
  );
  if (!verifyPassword) {
    return res.json({
      message: "Incorrect password, please check and try again",
    });
  }
  const payload = {
    id: is_userExist?._id,
    email: is_userExist?.email,
    role: is_userExist?.role,
  };
  let token = jwt.sign(payload, keys, {
    expiresIn: 86400,
  });
  const { _id, phone, city, states, password, address, __v, ...others } =
    is_userExist._doc;

  if (token) {
    return res.json({
      message: "login successful",
      token: "Bearer " + token,
      user: others,
    });
  }
};
exports.getCurrentUser = async (req, res, next) => {
  const user = await User.findOne(
    { _id: req.user.id },
    { _id: 0, password: 0, __v: 0, address: 0, city: 0, states: 0 }
  );
  return res.json({ message: "user exist", user });
};

exports.fundMyWallet = async (req, res, next) => {
  const { amount } = req.body;
  let verifyAmount =
    typeof amount === "number" && !isNaN(amount) && isFinite(amount);

  if (verifyAmount) {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.json({ errorResponse: " Record does not found" });
    } else {
      user.wallet = user.wallet + amount;
      let result = await user.save();
      if (result) {
        const { _id, phone, city, states, password, address, __v, ...others } =
          user._doc;

        return res.json({
          message: "your wallet has been credited",
          user: others,
        });
      }
    }
  } else {
    return res.json({ message: "please enter a valid value" });
  }
};
