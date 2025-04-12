const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  verificationRequired: {
    type: Boolean,
    default: true,
  },

  verification: {
    frontSide: String,
    backSide: String,
    documentType: String,
    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    rejectionReason: String,
    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  reportStatus: {
    type: String,
    enum: ["PENDING", "RESOLVED", "REJECTED"],
    default: "PENDING",
  },

  resolutionDescription: String,

  resolvedAt: Date,

  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SUPERADMIN",
  },
});

module.exports = mongoose.model("Report", reportSchema);
