const express = require("express");
const { authentication, authorization } = require("../middleware/auth");
let controller = require("../controllers/admin.controller");
const router = express.Router();

router.get("/all-user", authentication, controller.getAllUser);
router.get("/all-loan", [authentication, authorization], controller.getAllLoan);
router.get(
  "/get-message",
  [authentication, authorization],
  controller.getMessage
);
router.put(
  "/read-message",
  [authentication, authorization],
  controller.readMessage
);
router.post(
  "/:userId/:loanId/:amount/:status",
  [authentication, authorization],
  controller.grantLoan
);

router.post(
  "/:email",
  [authentication, authorization],
  controller.getGrantorInfo
);

module.exports = router;
