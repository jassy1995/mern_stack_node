const express = require("express");
let controller = require("../controllers/product.controller");
const { isAuth, isAdmin } = require("../middleware/auth");
const upload = require("../util/multer");

const router = express.Router();
router.get("/", controller.allProduct);
router.post(
  "/",
  [isAuth, isAdmin],
  upload.single("image"),
  controller.createProduct
);
router.get("/admin", [isAuth, isAdmin], controller.getAdminProduct);
router.get("/search", controller.filterProduct);
router.get("/categories", controller.productByCategory);
router.get("/slug/:slug", controller.productBySlug);
router.put(
  "/:id",
  [isAuth, isAdmin],
  upload.single("image"),
  controller.updateProduct
);
router.get("/:id", controller.productById);

module.exports = router;
