const express = require("express");
let controller = require("../controllers/user.controller");
const { authentication, authorization } = require("../middleware/auth");
const router = express.Router();
// const async = require("../middleware/async");

// router.post("/create-user", async(controller.createUser));
router.post("/create-user", controller.createUser);
router.post("/login-user", controller.loginUser);
router.get("/current-user", authentication, controller.getCurrentUser);
router.get("/fund-wallet", authentication, controller.fundMyWallet);

module.exports = router;
