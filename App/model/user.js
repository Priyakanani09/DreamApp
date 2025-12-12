const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  uid: { type: String, unique: true },

  email: { type: String },
  emailVerified: { type: Boolean, default: false },

  phone: { type: String },
  phoneVerified: { type: Boolean, default: false },

  displayName: { type: String },
  username: { type: String },
  gender: { type: String },

  dob: { type: String },
  avatarUrl: { type: String },

  role: {
    type: String,
    enum: ["user", "expert"],
    default: "user"
  },

  profileComplete: { type: Boolean, default: false },

  // Reference → only if role = expert
  expertProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpertProfile",
    default: null
  },

  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },

  termsAccepted: { type: Boolean, default: false },

  appToken: { type: String },
  platform: { type: String }

});

module.exports = mongoose.model("User", userSchema);
