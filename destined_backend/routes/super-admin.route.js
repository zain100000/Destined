const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const superAdminController = require("../controllers/super-admin.controller");

// Route to register a new SuperAdmin (handles profile picture upload)
router.post(
  "/signup-super-admin",
  profilePictureUpload.upload,
  superAdminController.registerSuperAdmin
);

// Route to log in a SuperAdmin
router.post("/signin-super-admin", superAdminController.loginSuperAdmin);

// Route to fetch a SuperAdmin by ID (requires authentication)
router.get(
  "/get-super-admin-by-id/:id",
  protect,
  superAdminController.getSuperAdminById
);

// Route to reset a SuperAdmin's password (requires authentication)
router.patch(
  "/reset-super-admin-password",
  protect,
  superAdminController.resetSuperAdminPassword
);

// Route to log out a SuperAdmin (requires authentication)
router.post(
  "/logout-super-admin",
  protect,
  superAdminController.logoutSuperAdmin
);

// Route to fetch all users by status (requires authentication)
router.get(
  "/get-user-by-status",
  protect,
  superAdminController.getUserByStatus
);

// Route to update user status (requires authentication)
router.patch("/verified-user/:id", protect, superAdminController.verifiedUser);

// Route to update user status (requires authentication)
router.patch(
  "/not-verified-user/:id",
  protect,
  superAdminController.notVerifiedUser
);

module.exports = router;
