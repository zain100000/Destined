const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware/auth.middleware");
const uploadMediaFiles = require("../utilities/cloudinary/cloudinary.utility");

const uploadMediaController = require("../controllers/media.controller");

router.post(
  "/upload-media",
  protect,
  uploadMediaFiles.upload,
  uploadMediaFiles.checkUploadedFiles,
  uploadMediaController.uploadMedia
);

module.exports = router;
