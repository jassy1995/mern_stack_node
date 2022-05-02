const Loan = require("../models/loan.model");
const User = require("../models/user.model");
const loanValidator = require("../validator/loan/loan-validator");

exports.createLoan = async (req, res, next) => {
  const { error, value } = loanValidator(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { title, first_grantor, second_grantor, amount } = req.body;
  const grantors = await User.find({
    email: { $in: [first_grantor, second_grantor] },
  });
  if (grantors.length !== 2) {
    return res.json({
      message: "your grantors record does not exist",
    });
  }
  let totalAmount = grantors[0].wallet + grantors[1].wallet;
  const user = await User.findById(req.user.id);
  if (user.email === first_grantor || user.email === second_grantor) {
    return res.json({
      message: "you cannot use your own email",
    });
  }
  if (
    user.wallet === 0 &&
    totalAmount < Number(amount) &&
    Number(amount) > 50000
  ) {
    return res.json({
      message: "the minimum amount you can get is 50,000",
    });
  }
  if (
    user.wallet > 0 &&
    totalAmount > 0 &&
    user.wallet + totalAmount < Number(amount)
  ) {
    return res.json({
      message: "Denied! please enter a lesser amount",
    });
  }
  const checkPreviousLoan = await User.find({
    _id: req.user.id,
    payment_status: "pay now",
  });
  const checkPendingLoan = await User.find({
    _id: req.user.id,
    payment_status: "pending",
  });
  if (checkPreviousLoan) {
    return res.json({
      errorResponse: "Denied! please first pay your previous loan",
    });
  } else if (checkPendingLoan) {
    return res.json({
      errorResponse: "Denied! You already have a pending  loan request",
    });
  } else {
    let amountToNumber = Number(amount);
    let refundAmount = 0.1 * amountToNumber + amountToNumber;
    let latePayment = 0.2 * amountToNumber + amountToNumber;
    let d = new Date();
    let deuDate = new Date(d.setMonth(d.getMonth() + 6));
    let newUserLoan = await Loan.create({
      title,
      first_grantor,
      second_grantor,
      refundAmount,
      latePayment,
      deuDate,
      userId: req.user.id,
    });
    return res.json({
      message: "you request has been received",
      user: newUserLoan,
    });
  }
};

exports.refundLoan = async (req, res) => {
  const { amount } = req.body;
  const { loanId } = req.params;
  const user = await User.findById(req.user.id);
  if (user.wallet < Number(amount)) {
    return res.json({
      message:
        "insufficient fund,please fund your wallet or enter a lesser amount",
    });
  } else {
    const loan = await Loan.findOne({
      _id: loanId,
      userId: req.user.id,
      payment_status: "pay now",
    });
    if (loan) {
      if (loan.refundAmount < Number(req.body.amount)) {
        return res.json({
          Response: "please enter appropriate amount",
        });
      } else if (loan.refundAmount > Number(req.body.amount)) {
        user.wallet = user.wallet - Number(amount);
        user.debitWallet = user.debitWallet - Number(amount);
        loan.refundAmount = loan.refundAmount - Number(req.body.amount);
        await user.save();
        await loan.save();
        return res.json({
          Response: "payment successful",
          user,
        });
      } else if (loan.refundAmount === Number(req.body.amount)) {
        user.wallet = user.wallet - Number(amount);
        user.debitWallet = user.debitWallet - Number(amount);
        loan.refundAmount = loan.refundAmount - Number(req.body.amount);
        loan.payment_status = "paid";
        loan.refundAmount = loan.latePayment / 1.2;
        await user.save();
        await loan.save();
        return res.json({
          Response: "payment completed",
          user,
        });
      }
    }
  }
};

exports.getAllMyLoan = async (req, res, next) => {
  const loans = await Loan.find({ _id: req.user.id }, { userId: 0 });
  return res.json({ message: "fetch successful", loans });
};
