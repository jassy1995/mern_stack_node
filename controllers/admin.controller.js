const Message = require("../models/message.model");
const Loan = require("../models/loan.model");
const User = require("../models/user.model");

exports.getAllUser = async (req, res, next) => {
  const users = await User.find({});
  return res.json({ message: "fetch successful", users });
};
exports.getAllLoan = async (req, res, next) => {
  const loans = await Loan.find({});
  return res.json({ message: "fetch successful", loans });
};
exports.getGrantorInfo = async (req, res, next) => {
  const grantor = await User.findOne({ email: req.params.email });
  const grantorLoanHistory = await Loan.find({
    userId: grantor._id,
  }).populate("userId");
  return res.json({ grantor: grantorLoanHistory });
};
exports.grantLoan = async (req, res, next) => {
  let { userId, loanId, amount, status } = req.params;
  let user = await User.findOne({ _id: userId });
  let loan = await Loan.findOne({
    _id: loanId,
    userId,
    request_status: "pending",
  });
  if (loan) {
    let newAdmin = await User.findOne({
      _id: req.user.id,
    });
    if (newAdmin.wallet < Number(amount)) {
      return res.json({
        message: "insufficient balance,please fund your wallet",
      });
    } else {
      if (status === "accept") {
        loan.request_status = "approved";
        loan.payment_status = "pay now";
        user.wallet = user.wallet + Number(amount);
        user.debitWallet = user.debitWallet + Number(amount);
        newAdmin.wallet = newAdmin.wallet - Number(amount);
        await loan.save();
        await user.save();
        await newAdmin.save();
        const { _id, phone, city, states, password, address, __v, ...others } =
          newAdmin._doc;
        return res.json({
          message: "approved",
          loan,
          user: others,
        });
      } else if (status === "decline") {
        loan.request_status = "rejected";
        loan.payment_status = "failed";
        await loan.save();
        return res.json({
          message: "rejected successfully",
          loan,
        });
      } else return;
    }
  }
};

exports.getMessage = async (req, res, next) => {
  const message = await Message.find({ status: "unread" });
  return res.json({ messages: message });
};

exports.readMessage = async (req, res, next) => {
  let result = await Message.updateMany(
    { status: "unread" },
    {
      $set: {
        status: "read",
      },
    }
  );
  return res.json({ message: result.acknowledged });
};
