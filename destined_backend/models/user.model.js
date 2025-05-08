const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    profilePicture: String,    

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    city: {
      type: String,
      maxlength: 20,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      default: "MALE",
    },

    dob: Date,

    age: Number,

    interests: [
      {
        interest: String,
        selectedOption: String,
      },
    ],

    likedByUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    liking: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        targetUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        action: {
          type: String,
          enum: ["LIKE", "DISLIKE"],
          required: true,
        },
        matches: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    profileMatches: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        targetUserId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        matchScore: {
          type: Number,
          min: 0,
          max: 100,
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
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: String,
      enum: ["PENDING", "VERIFIED", "NOT_VERIFIED"],
      default: "PENDING",
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    lastActive: {
      type: Date,
      default: Date.now,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    media: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        type: {
          type: String,
          enum: ["IMAGE", "VIDEO"],
          required: true,
        },
        url: {
          type: String,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
