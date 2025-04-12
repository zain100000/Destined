const bcrypt = require("bcrypt");
const SuperAdmin = require("../models/super-admin.model");
const User = require("../models/user.model");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const jwt = require("jsonwebtoken");

// Register a new SuperAdmin
exports.registerSuperAdmin = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const existingSuperAdmin = await SuperAdmin.findOne({
      email,
      role: "SUPERADMIN",
    });

    if (existingSuperAdmin) {
      return res.status(409).json({
        success: false,
        message: "SuperAdmin with this email already exists",
      });
    }

    let userProfileImageUrl = null;
    if (req.files?.profilePicture) {
      const uploadResult = await profilePictureUpload.uploadToCloudinary(
        req.files.profilePicture[0],
        "profilePicture"
      );
      userProfileImageUrl = uploadResult.url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = new SuperAdmin({
      profilePicture: userProfileImageUrl,
      userName,
      email,
      password: hashedPassword,
      role: "SUPERADMIN",
      isSuperAdmin: true,
    });

    await superAdmin.save();

    res.status(200).json({
      success: true,
      message: "SuperAdmin created successfully",
    });
  } catch (error) {
    console.error("Error creating super admin:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Login SuperAdmin
exports.loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let superadmin = await SuperAdmin.findOne({ email });
    if (!superadmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin Not Found!",
      });
    }

    const isMatch = await bcrypt.compare(password, superadmin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!",
      });
    }

    const payload = {
      role: "SUPERADMIN",
      user: {
        id: superadmin.id,
        email: superadmin.email,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error Generating Token!",
        });
      }

      res.json({
        success: true,
        message: "Super Admin Login Successfully",
        superAdmin: {
          id: superadmin.id,
          userName: superadmin.userName,
          email: superadmin.email,
        },
        token,
      });
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Logging In!",
    });
  }
};

// Get SuperAdmin by ID
exports.getSuperAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const superAdmin = await SuperAdmin.findById(id).select("-password");
    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin Not Found!",
      });
    }

    res.json({
      success: true,
      message: "Super Admin Fetched Successfully",
      superAdmin: superAdmin,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Getting Super Admin!",
    });
  }
};

// Reset SuperAdmin password
exports.resetSuperAdminPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    let superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin Not Found!",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    superAdmin.password = hashedPassword;
    await superAdmin.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Resetting Password!",
    });
  }
};

// Logout Super Admin
exports.logoutSuperAdmin = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout SuccessFully!",
      token: null,
    });
  } catch (err) {
    console.error("Error Logging Out:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get users BY status (SuperAdmin only)
exports.getUserByStatus = async (req, res) => {
  try {
    const { isVerified } = req.query;

    if (req.user.role !== "SUPERADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. SuperAdmin only.",
      });
    }

    if (!["PENDING", "VERIFIED", "NO_VERIFIED"].includes(isVerified)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Status. Allowed values are PENDING, VERIFIED, or NOT_VERIFIED.",
      });
    }

    const users = await User.find({ isVerified });

    res.status(200).json({
      success: true,
      message: `${isVerified} Users Fetched Successfully!`,
      users: users,
    });
  } catch (error) {
    console.error("Error fetching users by Status:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Verifued User Status
exports.verifiedUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (user.isActive === "VERIFIED") {
      return res.status(400).json({
        success: false,
        message: "User is already verified!",
      });
    }

    user.isActive = "VERIFIED";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User Status Changed Successfully!",
    });
  } catch (error) {
    console.error("Error verified user:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Not Verified User Status
exports.notVerifiedUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (user.isActive === "NOT_VERIFIED") {
      return res.status(400).json({
        success: false,
        message: "User is already not verified!",
      });
    }

    user.isActive = "NOT_VERIFIED";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User Status Changed Successfully!",
    });
  } catch (error) {
    console.error("Error verified user:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

