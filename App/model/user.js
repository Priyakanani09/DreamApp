const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },

  email: { type: String },

  phone: { type: Number },

  name: { type: String },
  username: { type: String },
  gender: { type: String },
  dob: {type: Date},

  avatarUrl: { type: String },

  role: {
    type: String,
    enum: ["user", "expert"],
    default: "user",
  },

  expertStatus: {
    type: String,
    enum: ["none", "pending", "active", "rejected"],
    default: "none",
  },

  profileCompleted: {
    type: Boolean,
    default: false,
  },

  termsAccepted: {
    type: Boolean,
    default: false,
  },

  expertProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExpertProfile",
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
