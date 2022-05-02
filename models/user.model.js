const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  states: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, required: true },
  wallet: { type: Number, default: 0, min: 0 },
  debitWallet: { type: Number, default: 0, min: 0 },
});

module.exports = mongoose.model("users", userSchema);
module.exports.userSchema = userSchema;
