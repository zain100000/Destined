const jwt = require("jsonwebtoken");
const SuperAdmin = require("../../models/super-admin.model");
const User = require("../../models/user.model");

// Authentication middleware to verify JWT tokens and authorize users
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access, Token is missing",
      });
    }

    const jwtToken = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if (!decodedToken?.user?.id || !decodedToken?.role) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Token Structure" });
    }

    const userModel = decodedToken.role === "SUPERADMIN" ? SuperAdmin : User;

    const user = await userModel
      .findById(decodedToken.user.id)
      .select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    req.user = {
      id: user._id.toString(),
      role: decodedToken.role,
      email: user.email,
      phone: user.phone,
    };

    req.userId = user._id.toString();

    next();
  } catch (error) {
    console.error("❌ Error Verifying Token:", error.message || error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;
