const express = require("express");
let controller = require("../controllers/product.controller");
// const { authentication } = require("../middleware/auth");
const router = express.Router();

router.get("/", controller.allProduct);
router.get("/slug/:slug", controller.productBySlug);
router.get("/:id", controller.productById);

module.exports = router;
