const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  emailVerified: Boolean,
  phone: String,
  phoneVerified: Boolean,
  createdAt: Date
});

module.exports = mongoose.model("register", registerSchema);