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

    // Check if this is a new like (not just updating from dislike)
    const existingLike = await Liking.findOne({
      user: trimmedUserId,
      targetUserId: trimmedTargetUserId,
    }).session(session);

    const isNewLike = !existingLike || existingLike.action !== "LIKE";

    // Create/update the like record
    const likingData = {
      user: trimmedUserId,
      targetUserId: trimmedTargetUserId,
      action: "LIKE",
      targetUserStats: {
        totalLikes: targetUser.totalLikesReceived,
        likedByUsers: targetUser.likedByUsers,
      },
    };

    if (isNewLike) {
      // Update target user's like stats
      targetUser.totalLikesReceived += 1;
      if (!targetUser.likedByUsers.includes(trimmedUserId)) {
        targetUser.likedByUsers.push(trimmedUserId);
      }
    }

    const isMutualLike = existingTargetLike?.action === "LIKE";

    if (isMutualLike) {
      // Add to matches if not already matched
      if (!user.matches.includes(trimmedTargetUserId)) {
        user.matches.push(trimmedTargetUserId);
      }
      if (!targetUser.matches.includes(trimmedUserId)) {
        targetUser.matches.push(trimmedUserId);
      }

      likingData.$addToSet = { matches: trimmedTargetUserId };
    }

    // Update or create the like record
    const liking = await Liking.findOneAndUpdate(
      { user: trimmedUserId, targetUserId: trimmedTargetUserId },
      likingData,
      { upsert: true, new: true, session }
    );

    // Update the user's liking array
    const userLikeIndex = user.liking.findIndex(
      (like) => like.targetUserId.toString() === trimmedTargetUserId
    );

    if (userLikeIndex !== -1) {
      user.liking[userLikeIndex].action = "LIKE";
      user.liking[userLikeIndex].createdAt = new Date();
      if (
        isMutualLike &&
        !user.liking[userLikeIndex].matches.includes(trimmedTargetUserId)
      ) {
        user.liking[userLikeIndex].matches.push(trimmedTargetUserId);
      }
    } else {
      user.liking.push({
        targetUserId: trimmedTargetUserId,
        action: "LIKE",
        matches: isMutualLike ? [trimmedTargetUserId] : [],
        createdAt: new Date(),
      });
    }

    // Update target user's like if mutual
    if (isMutualLike) {
      const targetLikeIndex = targetUser.liking.findIndex(
        (like) => like.targetUserId.toString() === trimmedUserId
      );

      if (
        targetLikeIndex !== -1 &&
        !targetUser.liking[targetLikeIndex].matches.includes(trimmedUserId)
      ) {
        targetUser.liking[targetLikeIndex].matches.push(trimmedUserId);
      }
    }

    await Promise.all([user.save({ session }), targetUser.save({ session })]);
    await session.commitTransaction();

    // Get complete like statistics for the target user
    const targetUserLikeStats = {
      totalLikes: targetUser.totalLikesReceived,
      likedByUsers: await User.find({ _id: { $in: targetUser.likedByUsers } })
        .select("firstName lastName profilePicture gender age")
        .lean(),
    };

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
          likeStats: targetUserLikeStats,
        },
        likingRecord: liking,
      },
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    console.error("Like error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
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

    const [user, targetUser, existingLike] = await Promise.all([
      User.findById(trimmedUserId).session(session),
      User.findById(trimmedTargetUserId).session(session),
      Liking.findOne({
        user: trimmedUserId,
        targetUserId: trimmedTargetUserId,
      }).session(session),
    ]);

    if (!user || !targetUser) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const wasLike = existingLike?.action === "LIKE";

    if (wasLike) {
      targetUser.totalLikesReceived = Math.max(
        0,
        targetUser.totalLikesReceived - 1
      );

      targetUser.likedByUsers = Array.isArray(targetUser.likedByUsers)
        ? targetUser.likedByUsers.filter(
            (id) => id.toString() !== trimmedUserId
          )
        : [];
    }

    // Remove matches if existed
    user.matches = Array.isArray(user.matches)
      ? user.matches.filter((match) => match.toString() !== trimmedTargetUserId)
      : [];

    targetUser.matches = Array.isArray(targetUser.matches)
      ? targetUser.matches.filter((match) => match.toString() !== trimmedUserId)
      : [];

    // Remove from user's liking array
    user.liking = Array.isArray(user.liking)
      ? user.liking.filter(
          (like) => like.targetUserId.toString() !== trimmedTargetUserId
        )
      : [];

    // Delete the like document
    await Liking.deleteOne({
      user: trimmedUserId,
      targetUserId: trimmedTargetUserId,
    }).session(session);

    await Promise.all([user.save({ session }), targetUser.save({ session })]);

    // Refresh like stats after update
    const targetUserLikeStats = {
      totalLikes: targetUser.totalLikesReceived,
      likedByUsers: await User.find({
        _id: { $in: targetUser.likedByUsers || [] },
      })
        .select("firstName lastName profilePicture gender age")
        .lean(),
    };

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "User disliked successfully",
      liking: {
        currentUser: {
          _id: user._id,
          matches: user.matches,
        },
        targetUser: {
          _id: targetUser._id,
          likeStats: targetUserLikeStats,
        },
      },
    });
  } catch (error) {
    if (session) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error("Error aborting transaction:", abortError);
      }
    }
    console.error("Dislike error:", error);
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

// Get all likings
exports.getAllLiking = async (req, res) => {
  try {
    // Get all likings with populated user and target user data
    const likings = await Liking.find()
      .populate("user")
      .populate("targetUserId")
      .lean();

    // For each liking, get the current stats of the target user
    const likingsWithStats = await Promise.all(
      likings.map(async (liking) => {
        const targetUser = await User.findById(liking.targetUserId)
          .select("totalLikesReceived likedByUsers")
          .populate("likedByUsers")
          .lean();

        // Merge current stats into targetUserStats
        return {
          ...liking,
          targetUserStats: {
            ...liking.targetUserStats,
            // Override with current data
            totalLikes: targetUser.totalLikesReceived,
            likedByUsers: targetUser.likedByUsers,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Likings fetched successfully with current stats",
      likings: likingsWithStats,
    });
  } catch (error) {
    console.error("Error fetching likings:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
