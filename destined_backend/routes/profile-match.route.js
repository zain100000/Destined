const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const profileMatchController = require("../controllers/profile-match.controller");

// Get compatible profiles
router.get(
  "/:userId/get-profile-matches",
  protect,
  profileMatchController.getProfileMatches
);


module.exports = router;
