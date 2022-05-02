require("express-async-errors");
const express = require("express");
const cors = require("cors");
const productRoute = require("../routes/product.route");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/api/products", productRoute);
  app.use(error);
};
