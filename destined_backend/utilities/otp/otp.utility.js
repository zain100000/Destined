let otpStore = {};

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

const storeOTP = (phone, otp) => {
  otpStore[phone] = {
    otp: otp,
    timestamp: Date.now(),
  };
};

const verifyOTP = (phone, enteredOtp) => {
  const stored = otpStore[phone];
  if (!stored) {
    return false;
  }

  const isExpired = Date.now() - stored.timestamp > 5 * 60 * 1000;
  if (isExpired) {
    delete otpStore[phone];
    return false;
  }

  return stored.otp === enteredOtp;
};

module.exports = { generateOTP, storeOTP, verifyOTP };
