const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  // uid: { type: String, required: true, unique: true },
  email: {type : String, unique : true},
  emailVerified: Boolean,
  phone: String,
  phoneVerified: Boolean,
  createdAt: Date,

  fcmToken: { type: String },
  platform: { type: String, enum: ["android", "ios"] },
  lastLoginAt: { type: Date },
});

module.exports = mongoose.model("register", registerSchema);