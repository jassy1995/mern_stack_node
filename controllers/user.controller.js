const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

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
