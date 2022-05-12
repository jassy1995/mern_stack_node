const express = require("express");
let controller = require("../controllers/user.controller");
const { isAuth, isAdmin } = require("../middleware/auth");
const router = express.Router();

router.post("/signup", controller.createUser);
router.get("/", [isAuth, isAdmin], controller.getUsers);
router.get("/:id", [isAuth, isAdmin], controller.getUser);
router.put("/:id", [isAuth, isAdmin], controller.updateUser);
router.delete("/:id", [isAuth, isAdmin], controller.deleteUser);
router.post("/signin", controller.signInUser);
router.put("/profile", isAuth, controller.updateUserInfo);

module.exports = router;
