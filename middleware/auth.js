require("dotenv").config();
const keys = process.env.OTP;
const jwt = require("jsonwebtoken");
exports.authentication = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.json({
      message: "A token is required for authentication",
      status: false,
    });
  } else {
    const decoded = jwt.verify(token, keys);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.json({ message: "Invalid Token", status: false });
    }
  }
};

exports.authorization = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.json({
      message: "Access denied! You are restricted to this action",
      status: false,
    });
  }
  next();
  return;
};
