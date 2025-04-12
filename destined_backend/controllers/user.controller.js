const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const jwt = require("jsonwebtoken");
const { v2: cloudinary } = require("cloudinary");
const { verifiedPhones } = require("../controllers/otp.controller");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const {
      phone,
      firstName,
      lastName,
      gender,
      dob,
      interests,
      email,
      password,
      lastActive,
      bio,
      age,
    } = req.body;

    if (!verifiedPhones.has(phone)) {
      return res.status(400).json({
        success: false,
        message: "OTP not verified. Please verify OTP first.",
      });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User With This Phone Number Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userProfileImageUrl = null;
    if (req.files?.profilePicture) {
      const uploadResult = await profilePictureUpload.uploadToCloudinary(
        req.files.profilePicture[0],
        "profilePicture"
      );
      userProfileImageUrl = uploadResult.url;
    }

    let calculatedAge = null;
    if (dob) {
      const birthDate = new Date(dob);
      const ageInMillis = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageInMillis);
      calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    } else {
      calculatedAge = age;
    }

    const user = new User({
      profilePicture: userProfileImageUrl,
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      gender,
      dob,
      age: calculatedAge,
      interests,
      lastActive,
      role: "USER",
      bio,
      isVerified: true,
    });

    await user.save();
    verifiedPhones.delete(phone); // Clean up after success

    res.status(200).json({
      success: true,
      message: "User Registered Successfully. Wait for admin approval.",
    });
  } catch (error) {
    console.error("Error During Registration:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    let user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (user.isActive === "PENDING") {
      return res.status(403).json({
        success: false,
        message: "Cannot login. Your profile is pending approval.",
      });
    } else if (user.isActive === "NOT_VERIFIED") {
      return res.status(403).json({
        success: false,
        message: "Cannot login. Your profile is not verified",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!",
      });
    }

    // Update isOnline to true and set lastActive to now when user logs in
    user.isOnline = true;
    user.lastActive = new Date(); // Set current time as lastActive
    await user.save();

    const payload = {
      role: "USER",
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        isOnline: user.isOnline, // Add isOnline here
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
        message: "User Login Successfully",
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          isOnline: user.isOnline, // Add isOnline here in the response
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

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    res.json({
      success: true,
      message: "User Fetched Successfully",
      user: user,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Getting User!",
    });
  }
};

// Reset user password
exports.resetUserPassword = async (req, res) => {
  try {
    const { phone, newPassword } = req.body;

    let user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

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

// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  try {
    let user = await User.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.interests) user.interests = req.body.interests;

    if (req.files && req.files.profilePicture) {
      const newProfilePicture = req.files.profilePicture[0];

      if (user.profilePicture) {
        try {
          const publicId = user.profilePicture.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(
            `Destined/profilePictures/${publicId}`
          );
        } catch (error) {
          console.error("❌ Error deleting old profile picture:", error);
        }
      }

      const result = await profilePictureUpload.uploadToCloudinary(
        newProfilePicture,
        "profilePicture"
      );

      user.profilePicture = result.url;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User Updated Successfully.",
      user,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Logout user
exports.logoutUser = async (req, res, next) => {
  try {
    const userId = req.userId; // Get userId from the request object (attached by the middleware)

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the lastActive timestamp before logging out
    user.lastActive = new Date();

    // Set user as offline
    user.isOnline = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User Logout Successfully!",
      token: null, // Clear the JWT token on logout
    });
  } catch (err) {
    console.error("Error Logging Out:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Profile
exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (user.profilePicture) {
      try {
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(
          `Destined/profilePictures/${publicId}`
        );
      } catch (error) {
        console.error("❌ Error deleting profile picture:", error);
      }
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User profile and all associated data deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Mark user as Online (when app opens)
exports.setUserOnline = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.isOnline = true;
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "User marked as online",
      user: {
        id: user._id,
        isOnline: user.isOnline,
        lastActive: user.lastActive,
      },
    });
  } catch (error) {
    console.error("❌ Error setting user online:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Mark user as Offline (when app closes)
exports.setUserOffline = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.isOnline = false;
    user.lastActive = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "User marked as offline",
      user: {
        id: user._id,
        isOnline: user.isOnline,
        lastActive: user.lastActive,
      },
    });
  } catch (error) {
    console.error("❌ Error setting user offline:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get User Status
exports.getUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("isOnline lastActive");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        isOnline: user.isOnline,
        lastActive: user.lastActive,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user status:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
