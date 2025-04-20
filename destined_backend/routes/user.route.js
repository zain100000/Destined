const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const userController = require("../controllers/user.controller");

// Route to register a new user (handles profile picture upload)
router.post(
  "/signup-user",
  profilePictureUpload.upload,
  userController.registerUser
);

// Route to login a user
router.post("/signin-user", userController.loginUser);

// Route to fetch a user by ID (requires authentication)
router.get("/get-user-by-id/:id", protect, userController.getUserById);

// Route to reset a user's password (requires authentication)
router.patch("/reset-user-password", protect, userController.resetUserPassword);

// Route to update a user's profile (requires authentication)
router.patch(
  "/update-user/:id",
  profilePictureUpload.upload,
  protect,
  userController.updateUser
);

// Route to log out a user (requires authentication)
router.post("/logout-user", protect, userController.logoutUser);

// Route to delete user profile (requires authentication)
router.delete("/delete-user/:id", protect, userController.deleteProfile);

// Route to set user online
router.post("/set-online-status", protect, userController.setUserOnline);

// Route to set user offline
router.post("/set-offline-status", protect, userController.setUserOffline);

// Route to get user status
router.get("/get-user-status/:id", protect, userController.getUserStatus);

module.exports = router;
