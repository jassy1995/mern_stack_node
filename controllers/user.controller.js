const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../util/scripts/jwt");
const e = require("express");

exports.createUser = async (req, res, next) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: req.body.isAdmin && Boolean(req.body.isAdmin),
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

exports.updateUserInfo = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await user.save();
    return res.send({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser),
    });
  } else {
    return res.status(404).send({ message: "User not found" });
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  return res.send(users);
};

exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    return res.send(user);
  } else {
    return res.status(404).send({ message: "User Not Found" });
  }
};

exports.updateUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password
      ? bcrypt.hashSync(req.body.password, 8)
      : user.password;
    user.isAdmin = req.body.isAdmin ? Boolean(req.body.isAdmin) : user.isAdmin;
    const updatedUser = await user.save();
    return res.send({ message: "User Updated", user: updatedUser });
  } else {
    return res.status(404).send({ message: "User Not Found" });
  }
};

exports.deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    return res.send({ message: "User Deleted" });
  } else {
    return res.status(404).send({ message: "User Not Found" });
  }
};
