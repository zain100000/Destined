const User = require("../models/user.model");
const ProfileMatch = require("../models/profile-match.model");

exports.getProfileMatches = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findById(userId);

    if (!currentUser?.interests?.length) {
      return res.status(200).json({
        success: true,
        message: "No interests found for this user",
        profileMatches: [],
      });
    }

    // Fetch potential matches excluding the current user and ensuring they are verified
    const potentialMatches = await User.find({
      _id: { $ne: userId },
      isActive: "VERIFIED",
      interests: { $exists: true, $not: { $size: 0 } },
    });

    const matchesToSave = [];
    const profileMatchesForUserDoc = [];

    const enrichedMatches = potentialMatches
      .map((user) => {
        // Find shared interests between the current user and potential match
        const shared = user.interests.filter((i) =>
          currentUser.interests.some(
            (ci) =>
              ci.interest === i.interest &&
              ci.selectedOption === i.selectedOption
          )
        );

        // Calculate match score based on the number of shared interests
        matchScore =
          (shared.length /
            ((currentUser.interests.length + user.interests.length) / 2)) *
          100;

        // Check if it's a perfect match (i.e., the shared interests match the current user's interests exactly)
        const isPerfectMatch =
          shared.length === currentUser.interests.length &&
          shared.length === user.interests.length;

        // Only save users with at least one shared interest
        if (shared.length > 0) {
          matchesToSave.push({
            updateOne: {
              filter: { userId, targetUserId: user._id },
              update: {
                $set: {
                  userId,
                  targetUserId: user._id,
                  matchScore,
                  sharedInterests: shared,
                  createdAt: new Date(),
                },
              },
              upsert: true,
            },
          });

          // Store minimal info in User model's profileMatches
          profileMatchesForUserDoc.push({
            userId: user._id,
            matchScore,
            sharedInterests: shared,
            createdAt: new Date(),
          });

          // Return enriched match data with the correct match score and perfect match flag
          return {
            ...user.toObject(),
            matchScore,
            sharedInterests: shared,
            isPerfectMatch, // Only set this flag to true if all shared interests match
          };
        }

        return null;
      })
      .filter(Boolean) // Filter out any null values (users with no shared interests)
      .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score in descending order

    // Save all matches to profileMatches collection
    if (matchesToSave.length > 0) {
      await ProfileMatch.bulkWrite(matchesToSave);
    }

    // Update the user's `profileMatches` field in User document
    await User.findByIdAndUpdate(userId, {
      $set: {
        profileMatches: profileMatchesForUserDoc,
      },
    });

    // Return the profile matches (including perfect and non-perfect matches)
    res.status(200).json({
      success: true,
      message: "Matches found and updated",
      profileMatches: enrichedMatches, // This includes both perfect and non-perfect matches
    });
  } catch (error) {
    console.error("Error calculating/saving profile matches:", error);
    res.status(500).json({
      success: false,
      message: "Error processing matches",
    });
  }
};
