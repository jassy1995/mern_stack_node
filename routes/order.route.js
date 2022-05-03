const express = require("express");
let controller = require("../controllers/order.controller");
const { isAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/", isAuth, controller.createOrder);
router.get("/mine", isAuth, controller.getCurrentUserOrder);
router.get("/:id", isAuth, controller.getOrderById);
router.put("/:id/pay", isAuth, controller.updateOrderById);

module.exports = router;
