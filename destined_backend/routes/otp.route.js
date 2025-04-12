const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otp.controller");

// Send OTP
router.post("/send-otp", otpController.sendOTP);

// Verify OTP
router.post("/verify-otp", otpController.verifyOTPHandler);

module.exports = router;
