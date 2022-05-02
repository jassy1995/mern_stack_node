require("express-async-errors");
const express = require("express");
const cors = require("cors");
const userRoute = require("../routes/user.route");
const loansRoute = require("../routes/loan.route");
const adminRoute = require("../routes/admin.route");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/api/v2", userRoute);
  app.use("/api/v2", loansRoute);
  app.use("/api/v2", adminRoute);
  app.use(error);
};
