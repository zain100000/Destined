const mongoose = require("mongoose");
const User = require("../models/user.model");
const Liking = require("../models/liking.model");

// Like User
exports.likeUser = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { userId } = req.params;
    const { targetUserId } = req.body;

    if (!userId || !targetUserId) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Missing user IDs",
      });
    }

    const trimmedUserId = userId.toString().trim();
    const trimmedTargetUserId = targetUserId.toString().trim();

    if (
      !mongoose.Types.ObjectId.isValid(trimmedUserId) ||
      !mongoose.Types.ObjectId.isValid(trimmedTargetUserId)
    ) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    if (trimmedUserId === trimmedTargetUserId) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Cannot interact with yourself",
      });
    }

    const [user, targetUser, existingTargetLike] = await Promise.all([
      User.findById(trimmedUserId).session(session),
      User.findById(trimmedTargetUserId).session(session),
      Liking.findOne({
        user: trimmedTargetUserId,
        targetUserId: trimmedUserId,
      }).session(session),
    ]);

    if (!user || !targetUser) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.matches) user.matches = [];
    if (!targetUser.matches) targetUser.matches = [];
    if (!user.liking) user.liking = [];
    if (!targetUser.liking) targetUser.liking = [];

    const userLikeIndex = user.liking.findIndex(
      (like) => like.targetUserId.toString() === trimmedTargetUserId
    );

    if (userLikeIndex !== -1) {
      user.liking[userLikeIndex].action = "LIKE";
      user.liking[userLikeIndex].createdAt = new Date();
    } else {
      user.liking.push({
        targetUserId: trimmedTargetUserId,
        action: "LIKE",
        matches: [],
        createdAt: new Date(),
      });
    }

    const isMutualLike = existingTargetLike?.action === "LIKE";

    const likingUpdate = {
      user: trimmedUserId,
      targetUserId: trimmedTargetUserId,
      action: "LIKE",
      createdAt: new Date(),
    };

    if (isMutualLike) {
      if (!user.matches.includes(trimmedTargetUserId)) {
        user.matches.push(trimmedTargetUserId);
      }
      if (!targetUser.matches.includes(trimmedUserId)) {
        targetUser.matches.push(trimmedUserId);
      }

      const updatedUserLikeIndex = user.liking.findIndex(
        (like) => like.targetUserId.toString() === trimmedTargetUserId
      );
      if (
        updatedUserLikeIndex !== -1 &&
        !user.liking[updatedUserLikeIndex].matches.includes(trimmedTargetUserId)
      ) {
        user.liking[updatedUserLikeIndex].matches.push(trimmedTargetUserId);
      }

      const targetLikeIndex = targetUser.liking.findIndex(
        (like) => like.targetUserId.toString() === trimmedUserId
      );
      if (
        targetLikeIndex !== -1 &&
        !targetUser.liking[targetLikeIndex].matches.includes(trimmedUserId)
      ) {
        targetUser.liking[targetLikeIndex].matches.push(trimmedUserId);
      }

      await Liking.updateOne(
        { user: trimmedTargetUserId, targetUserId: trimmedUserId },
        { $addToSet: { matches: trimmedUserId } },
        { session }
      );
    }

    if (isMutualLike) {
      likingUpdate.$addToSet = { matches: trimmedTargetUserId };
    }
    await Liking.updateOne(
      { user: trimmedUserId, targetUserId: trimmedTargetUserId },
      likingUpdate,
      { upsert: true, session }
    );

    await user.save({ session });
    await targetUser.save({ session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "User Liked Successfully",
      liking: {
        isMatch: isMutualLike,
        currentUser: {
          _id: user._id,
          matches: user.matches,
          liking: user.liking.find(
            (like) => like.targetUserId.toString() === trimmedTargetUserId
          ),
        },
        targetUser: {
          _id: targetUser._id,
          matches: targetUser.matches,
        },
      },
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    console.error("Like error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

// Dislike User
exports.dislikeUser = async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { userId } = req.params;
    const { targetUserId } = req.body;

    if (!userId || !targetUserId) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Missing user IDs" });
    }

    const trimmedUserId = userId.toString().trim();
    const trimmedTargetUserId = targetUserId.toString().trim();

    if (
      !mongoose.Types.ObjectId.isValid(trimmedUserId) ||
      !mongoose.Types.ObjectId.isValid(trimmedTargetUserId)
    ) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    if (trimmedUserId === trimmedTargetUserId) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Cannot interact with yourself" });
    }

    const [user, targetUser] = await Promise.all([
      User.findById(trimmedUserId).session(session),
      User.findById(trimmedTargetUserId).session(session),
    ]);

    if (!user || !targetUser) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.liking) user.liking = [];
    if (!user.matches) user.matches = [];
    if (!targetUser.matches) targetUser.matches = [];

    user.liking = user.liking.filter(
      (like) => like.targetUserId.toString() !== trimmedTargetUserId
    );
    targetUser.matches = targetUser.matches.filter(
      (match) => match.toString() !== trimmedUserId
    );
    user.matches = user.matches.filter(
      (match) => match.toString() !== trimmedTargetUserId
    );

    await Liking.deleteOne({
      user: trimmedUserId,
      targetUserId: trimmedTargetUserId,
    }).session(session);
    await Liking.deleteOne({
      user: trimmedTargetUserId,
      targetUserId: trimmedUserId,
    }).session(session);

    await Promise.all([user.save({ session }), targetUser.save({ session })]);

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "User dislike successfully",
      liking: {
        currentUser: { _id: user._id },
        targetUser: { _id: targetUser._id },
      },
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    console.error("Dislike error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  } finally {
    if (session) await session.endSession();
  }
};

// Get All Liking
exports.getAllLiking = async (req, res) => {
  try {
    const likings = await Liking.find()
      .populate("targetUserId")
      .populate("user");
    res.status(200).json({
      success: true,
      message: "Likings Fetched Successfully",
      likings,
    });
  } catch (error) {
    console.error("❌ Error fetching liking data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
