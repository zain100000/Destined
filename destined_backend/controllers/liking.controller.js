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
      return res
        .status(400)
        .json({ success: false, message: "Missing user IDs" });
    }

    const trimmedUserId = userId.trim();
    const trimmedTargetUserId = targetUserId.trim();

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

    const [user, targetUser, existingTargetLike, existingUserLike] =
      await Promise.all([
        User.findById(trimmedUserId).session(session),
        User.findById(trimmedTargetUserId).session(session),
        Liking.findOne({
          user: trimmedTargetUserId,
          targetUserId: trimmedUserId,
        }).session(session),
        Liking.findOne({
          user: trimmedUserId,
          targetUserId: trimmedTargetUserId,
        }).session(session),
      ]);

    if (!user || !targetUser) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMutualLike = existingTargetLike?.action === "LIKE";
    const wasAlreadyLiked = existingUserLike?.action === "LIKE";

    const likingData = {
      user: trimmedUserId,
      targetUserId: trimmedTargetUserId,
      action: "LIKE",
      createdAt: new Date(),
    };

    if (isMutualLike) {
      likingData.matches = [trimmedTargetUserId];
    }

    await Liking.findOneAndUpdate(
      { user: trimmedUserId, targetUserId: trimmedTargetUserId },
      { $set: likingData, $inc: { totalLikes: 1 } },
      { upsert: true, session }
    );

    // Update targetUser's totalLikes only if this is a new LIKE (not a re-like)
    if (!wasAlreadyLiked) {
      targetUser.totalLikes = (targetUser.totalLikes || 0) + 1;
    }

    // Add match to reverse side if mutual
    if (isMutualLike) {
      await Liking.updateOne(
        { user: trimmedTargetUserId, targetUserId: trimmedUserId },
        { $addToSet: { matches: trimmedUserId } },
        { session }
      );
    }

    await targetUser.save({ session });

    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      message: "User liked successfully",
      liking: {
        isMatch: isMutualLike,
        userId: trimmedUserId,
        targetUserId: trimmedTargetUserId,
      },
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    console.error("Like error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  } finally {
    if (session) await session.endSession();
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

    const trimmedUserId = userId.trim();
    const trimmedTargetUserId = targetUserId.trim();

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

    const [user, targetUser, existingUserLike] = await Promise.all([
      User.findById(trimmedUserId).session(session),
      User.findById(trimmedTargetUserId).session(session),
      Liking.findOne({
        user: trimmedUserId,
        targetUserId: trimmedTargetUserId,
      }).session(session),
    ]);

    if (!user || !targetUser) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const wasLiked = existingUserLike?.action === "LIKE";

    // Update Liking record to DISLIKE and clear matches
    await Liking.findOneAndUpdate(
      { user: trimmedUserId, targetUserId: trimmedTargetUserId },
      {
        $set: { action: "DISLIKE", matches: [], createdAt: new Date() },
        $inc: { totalLikes: -1 },
      },
      { session }
    );

    // Remove this user from matches in the reverse Liking
    await Liking.updateOne(
      { user: trimmedTargetUserId, targetUserId: trimmedUserId },
      { $pull: { matches: trimmedUserId } },
      { session }
    );

    // Decrease target user's totalLikes if this was previously liked
    if (wasLiked) {
      targetUser.totalLikes = Math.max((targetUser.totalLikes || 1) - 1, 0);
      await targetUser.save({ session });
    }

    await session.commitTransaction();
    return res.status(200).json({
      success: true,
      message: "User disliked successfully",
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    console.error("Dislike error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
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
