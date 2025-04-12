const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Config
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  if (!file) return cb(new Error("No file uploaded."), false);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "video/mp4",
    "video/quicktime",
    "video/x-matroska",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, WEBP images and MP4/MOV/MKV videos are allowed."
      ),
      false
    );
  }
};

// File size limit: 5MB
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "frontSide", maxCount: 1 },
  { name: "backSide", maxCount: 1 },
  { name: "mediaImage", maxCount: 5 },
  { name: "mediaVideo", maxCount: 3 },
]);

// Middleware to check files
const checkUploadedFiles = (req, res, next) => {
  if (!req.files) {
    return res
      .status(400)
      .json({ success: false, message: "No files uploaded" });
  }
  next();
};

// Upload to Cloudinary
const uploadToCloudinary = async (file, type, userId) => {
  const timestamp = Date.now();
  let folder = "";
  let publicId = "";
  let transformation = {};
  let resourceType = "image"; // default

  switch (type) {
    case "profilePicture":
      folder = `Destined/profilePictures/${userId}`;
      publicId = `profile_${timestamp}`;
      transformation = {
        width: 500,
        height: 500,
        crop: "fill",
        quality: "auto",
      };
      break;
    case "frontSide":
      folder = `Destined/Report_Verifications/${userId}`;
      publicId = `front_${timestamp}`;
      transformation = { quality: "auto", secure: true };
      break;
    case "backSide":
      folder = `Destined/Report_Verifications/${userId}`;
      publicId = `back_${timestamp}`;
      transformation = { quality: "auto", secure: true };
      break;
    case "mediaImage":
      folder = `Destined/Media/${userId}`;
      publicId = `media_image_${timestamp}`;
      transformation = { quality: "auto" };
      break;
    case "mediaVideo":
      folder = `Destined/Media/${userId}`;
      publicId = `media_video_${timestamp}`;
      resourceType = "video";
      break;
    default:
      throw new Error("Invalid upload type");
  }

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      public_id: publicId,
      transformation,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: false,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error(`❌ Cloudinary Upload Error (${type}):`, error);
    throw new Error(`Failed to upload ${type}`);
  }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    if (!publicId) return;
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === "ok";
  } catch (error) {
    console.error("❌ Cloudinary Deletion Error:", error);
    throw new Error("Failed to delete file");
  }
};

module.exports = {
  upload,
  checkUploadedFiles,
  uploadToCloudinary,
  deleteFromCloudinary,
};
