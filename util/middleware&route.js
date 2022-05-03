require("express-async-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const productRoute = require("../routes/product.route");
const userRoute = require("../routes/user.route");
const orderRoute = require("../routes/order.route");
const error = require("../middleware/error");
const clientKey = require("../middleware/clientkey");

module.exports = function (app) {
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/api/keys/paypal", clientKey);
  app.use("/api/products", productRoute);
  app.use("/api/users", userRoute);
  app.use("/api/orders", orderRoute);

  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "/client/build/index.html"))
  );

  app.use(error);
};
