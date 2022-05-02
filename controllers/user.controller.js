const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../util/scripts/jwt");

exports.createUser = async (req, res, next) => {
  const users = [
    {
      name: "Basir",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("admin"),
      isAdmin: true,
    },
    {
      name: "Babatunde",
      email: "babatunde@gmail.com",
      password: bcrypt.hashSync("babatunde"),
      isAdmin: false,
    },
  ];

  const createdUsers = await User.insertMany(users);
  return res.send(createdUsers);
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
        message: "Invalid email or password,please check and try again",
      });
    }
  } else {
    return res.status(401).send({
      message: "Invalid email or password,please check and try again",
    });
  }
};
