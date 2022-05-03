const express = require("express");
let controller = require("../controllers/user.controller");
const { isAuth } = require("../middleware/auth");
const router = express.Router();

router.post("/signup", controller.createUser);
router.post("/signin", controller.signInUser);
router.put("/profile", isAuth, controller.updateUserInfo);

module.exports = router;
