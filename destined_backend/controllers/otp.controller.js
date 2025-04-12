const {
  generateOTP,
  storeOTP,
  verifyOTP,
} = require("../utilities/otp/otp.utility");

// In-memory store for verified phones
let verifiedPhones = new Set();

// Expose to user controller
exports.verifiedPhones = verifiedPhones;

// Step 1 - Send OTP
exports.sendOTP = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  const otp = generateOTP();
  storeOTP(phone, otp);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully",
    otp, // remove this in production
  });
};

// Step 2 - Verify OTP
exports.verifyOTPHandler = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Phone and OTP are required" });
  }

  const isValid = verifyOTP(phone, otp);
  if (!isValid) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or expired OTP" });
  }

  verifiedPhones.add(phone);

  res.status(200).json({
    success: true,
    message: "OTP verified successfully. You can now register.",
  });
};
