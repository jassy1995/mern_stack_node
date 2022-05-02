const Product = require("../models/product.model");

exports.allProduct = async (req, res, next) => {
  const products = await Product.find();
  return res.send(products);
};

exports.productBySlug = async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    return res.send(product);
  } else {
    return res.status(404).send({ message: "Product Not Found" });
  }
};

exports.productById = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.send(product);
  } else {
    return res.status(404).send({ message: "Product Not Found" });
  }
};
