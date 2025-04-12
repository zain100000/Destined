const Media = require("../models/media.model");
const User = require("../models/user.model");
const {
  uploadToCloudinary,
} = require("../utilities/cloudinary/cloudinary.utility");

exports.uploadMedia = async (req, res) => {
  try {
    const userId = req.userId;
    const mediaData = [];

    if (req.files.mediaImage) {
      for (const file of req.files.mediaImage) {
        const result = await uploadToCloudinary(file, "mediaImage", userId);
        mediaData.push({
          user: userId,
          type: "IMAGE",
          url: result.url,
        });
      }
    }

    if (req.files.mediaVideo) {
      for (const file of req.files.mediaVideo) {
        const result = await uploadToCloudinary(file, "mediaVideo", userId);
        mediaData.push({
          user: userId,
          type: "VIDEO",
          url: result.url,
        });
      }
    }

    const savedMedia = await Media.insertMany(mediaData);

    await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          media: {
            $each: savedMedia.map((item) => ({
              user: item.user,
              type: item.type,
              url: item.url,
              uploadedAt: item.uploadedAt,
            })),
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Upload Successfully",
      media: savedMedia,
    });
  } catch (error) {
    console.error("Media Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload and save media",
    });
  }
};
