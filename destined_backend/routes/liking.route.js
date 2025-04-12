const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const likingController = require("../controllers/liking.controller");

// Route to like  (requires authentication)
router.post("/:userId/like-user", protect, likingController.likeUser);

// Route to dislike (requires authentication)
router.post("/:userId/dislike-user", protect, likingController.dislikeUser);

// Route to get all likings (requires authentication)
router.get("/get-all-likings", protect, likingController.getAllLiking);

// Export the router for use in the main application
module.exports = router;
