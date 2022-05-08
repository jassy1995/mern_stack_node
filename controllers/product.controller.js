require("dotenv").config();
const Product = require("../models/product.model");
const cloudinary = require("../util/cloudinary");
const algoliasearch = require("algoliasearch");
const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);
const angoliaIndex = client.initIndex("products");

const PAGE_SIZE = 10;

exports.createProduct = async (req, res, next) => {
  const result = await cloudinary.uploader.upload(req.file?.path, {
    folder: "product_images",
  });
  const newProduct = new Product({
    name: req.body.name + "/" + Date.now(),
    slug: req.body.slug + Date.now(),
    image: result.secure_url,
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    count: req.body.count,
    rating: 0,
    numReviews: 0,
    description: req.body.description,
    image_id: result.public_id,
  });
  const product = await newProduct.save();

  await angoliaIndex.saveObject({
    _id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    rating: product.rating,
    numReviews: product.numReviews,
    image: product.image,
    price: product.price,
    category: product.category,
    brand: product.brand,
    count: product.count,
    objectID: product._id,
  });
  return res.send({ message: "Product Created", product });
};
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

exports.productByCategory = async (req, res, next) => {
  const categories = await Product.find().distinct("category");
  return res.send(categories);
};

exports.filterProduct = async (req, res, next) => {
  const { query } = req;
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const order = query.order || "";
  const searchQuery = query.query || "";

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};
  const categoryFilter = category && category !== "all" ? { category } : {};
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};

  const priceFilter =
    price && price !== "all"
      ? {
          // 1-50
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const sortOrder =
    order === "featured"
      ? { featured: -1 }
      : order === "lowest"
      ? { price: 1 }
      : order === "highest"
      ? { price: -1 }
      : order === "toprated"
      ? { rating: -1 }
      : order === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const products = await Product.find({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });

  return res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
};

exports.getAdminProduct = async (req, res, next) => {
  const { query } = req;
  const page = query.page || 1;
  const pageSize = query.pageSize || PAGE_SIZE;

  const products = await Product.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .sort({ createdAt: -1 });
  const countProducts = await Product.countDocuments();
  return res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
};

exports.updateProduct = async (req, res, next) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  let imageUrl = "";
  let imageId = "";
  if (req.file?.path) {
    await cloudinary.uploader.destroy(product.image_id);
    const result = await cloudinary.uploader.upload(req.file?.path, {
      folder: "product_images",
    });
    imageUrl = result.secure_url;
    imageId = result.public_id;
  }

  if (product) {
    product.name = req.body.name || product.name;
    product.slug = req.body.slug || product.slug;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.countInStock = req.body.count || product.count;
    product.description = req.body.description || product.description;
    product.image = imageUrl || product.image;
    product.image_id = imageId || product.image_id;

    await angoliaIndex.partialUpdateObject({
      name: product.name,
      slug: product.slug,
      description: product.description,
      rating: product.rating,
      numReviews: product.numReviews,
      image: product.image,
      price: product.price,
      category: product.category,
      brand: product.brand,
      count: product.count,
      objectID: product._id,
    });

    await product.save();
    res.send({ message: "Product Updated" });
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
};
