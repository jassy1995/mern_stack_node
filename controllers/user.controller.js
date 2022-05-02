const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../util/scripts/jwt");

exports.createUser = async (req, res, next) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });
  const user = await newUser.save();
  return res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user),
  });
};

exports.signInUser = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      return res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    } else {
      return res.status(401).send({
        message: "Invalid email or password! Please check and try again",
      });
    }
  } else {
    return res.status(401).send({
      message: "Invalid email or password! Please check and try again",
    });
  }
};
