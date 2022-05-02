const express = require("express");
const winston = require("./loggers");
const _ = require("lodash");
const app = express();
require("dotenv").config();

const { data } = require("./util/data");
require("dotenv").config();
require("./util/db")();
require("./util/middleware&route")(app);
require("./util/config")();

app.get("/api/products", (req, res, next) => {
  if (data?.products) {
    return res.status(200).json(data);
  } else {
    return res.status(401).json({ message: "product not found" });
  }
});

app.get("/api/products/:id", (req, res, next) => {
  const product = _.find(data.products, (x) => +x._id === +req.params.id);
  if (product) {
    return res.status(200).send(product);
  } else {
    return res.status(401).send({ message: "product not found" });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  winston.info(`Server is running at port ${PORT}`);
});
