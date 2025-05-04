const mongoose = require("mongoose");

const likingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],

  action: {
    type: String,
    enum: ["LIKE", "DISLIKE"],
    required: true,
  },

  totalLikes: {
    type: Number,
    default: 0,
    min: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Liking", likingSchema);
