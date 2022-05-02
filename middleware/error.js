const winston = require("../loggers");
module.exports = function (err, req, res, next) {
  winston.error(err.message, err);
  res.status(500).json({ message: "Something went wrong", error: err.message });
};
