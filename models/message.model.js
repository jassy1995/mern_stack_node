const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  message: { type: String, required: true },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now(), required: true },
});

module.exports = mongoose.model("messages", MessageSchema);
