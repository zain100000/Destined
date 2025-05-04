const mongoose = require("mongoose");

const likingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    // Track like statistics at the time of liking
    targetUserStats: {
      totalLikes: {
        type: Number,
        default: 0,
      },
      likedByUsers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: [],
        },
      ],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one like per user-target pair
likingSchema.index({ user: 1, targetUserId: 1 }, { unique: true });

module.exports = mongoose.model("Liking", likingSchema);
