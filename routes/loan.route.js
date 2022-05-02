const express = require("express");
let controller = require("../controllers/loan.controller");
const { authentication } = require("../middleware/auth");
const router = express.Router();

router.post("/create-loan", authentication, controller.createLoan);
router.post("/refund-loan/:loanId", authentication, controller.refundLoan);
router.get("/all-my-loan", authentication, controller.getAllMyLoan);

module.exports = router;
