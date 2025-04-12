const mongoose = require("mongoose");

const profileMatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },

  sharedInterests: [
    {
      interest: String,
      selectedOption: String,
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

profileMatchSchema.index({ userId: 1, targetUserId: 1 }, { unique: true });
profileMatchSchema.index({ userId: 1, matchScore: -1 });

module.exports = mongoose.model("profileMatch", profileMatchSchema);
