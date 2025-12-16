const mongoose = require("mongoose");

const expertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  expertiseAreas: [String],
  experienceYears: {type: Number,default: 0 },
  bio: { type: String },
  paymentId: {
    type: String,
    required: true
  },
  fee: { type: Number, default: 50,immutable: true },
  available: { type: Boolean, default: true,immutable: true },

});

module.exports = mongoose.model("ExpertProfile", expertSchema);