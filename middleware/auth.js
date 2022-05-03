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

exports.isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    return res.status(401).send({ message: "Token is required" });
  }
};
