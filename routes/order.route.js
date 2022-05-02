const express = require("express");
let controller = require("../controllers/route.controller");
const { isAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/", isAuth, controller.createOrder);

module.exports = router;
