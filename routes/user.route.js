const express = require("express");
let controller = require("../controllers/user.controller");
// const { authentication } = require("../middleware/auth");
const router = express.Router();

router.post("/create-user", controller.createUser);

module.exports = router;
