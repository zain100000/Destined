const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const protect = require("../middlewares/authMiddleware/auth.middleware");

// Send a new message
router.post("/send-message", protect, chatController.sendMessage);

// Get chat messages between two users
router.get(
  "/get-all-messages/:senderId/:receiverId",
  protect,
  chatController.getMessages
);

module.exports = router;
