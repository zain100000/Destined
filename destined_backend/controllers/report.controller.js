const Report = require("../models/report.model");
const User = require("../models/user.model");
const {
  uploadToCloudinary,
} = require("../utilities/cloudinary/cloudinary.utility");

// Submit Report
exports.submitReport = async (req, res) => {
  try {
    const reporter = req.user.id;
    const { reportedUser, reason, description } = req.body;

    const reported = await User.findById(reportedUser);
    if (!reported) {
      return res
        .status(404)
        .json({ success: false, message: "Reported user not found" });
    }

    const report = await Report.create({
      reporter,
      reportedUser,
      reason,
      description,
    });

    res.status(200).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit report",
    });
  }
};

// Submit Verification Proof
exports.submitVerificationProof = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reportId, documentType } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (report.reportedUser.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not the user being reported",
      });
    }

    if (!report.verificationRequired) {
      return res.status(400).json({
        success: false,
        message: "Verification has already been submitted or is not required",
      });
    }

    const { frontSide, backSide } = req.files;
    if (!frontSide) {
      return res.status(400).json({
        success: false,
        message: "Front side image is required",
      });
    }

    const requireBackSide =
      documentType === "NATIONAL_ID" || documentType === "DRIVING_LICENSE";
    if (requireBackSide && !backSide) {
      return res.status(400).json({
        success: false,
        message: "Back side image is required for this document type",
      });
    }

    const frontSideUpload = await uploadToCloudinary(
      frontSide[0],
      "frontSide",
      userId
    );
    let backSideUpload = null;
    if (requireBackSide) {
      backSideUpload = await uploadToCloudinary(
        backSide[0],
        "backSide",
        userId
      );
    }

    const verificationData = {
      documentType,
      frontSide: frontSideUpload.url,
      backSide: backSideUpload?.url || null,
      verificationStatus: "PENDING",
      reportedUserId: report.reportedUser,
    };

    report.verification = verificationData;
    report.verificationRequired = false;
    await report.save();

    res.status(200).json({
      success: true,
      message: "Verification proof submitted successfully",
      verificationProof: verificationData,
    });
  } catch (error) {
    console.error("Verification proof submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit verification proof",
      error: error.message,
    });
  }
};

// Update Verification Status
exports.updateVerificationStatus = async (req, res) => {
  try {
    const { reportId, verificationStatus } = req.body;
    const adminId = req.user._id;

    // Validate the verification status
    if (!["APPROVED", "REJECTED"].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status",
      });
    }

    // Find the report by ID
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }    

    // Update the verification status in the nested verification object
    report.verification.verificationStatus = verificationStatus;
    report.verification.verifiedAt = new Date();
    report.verification.verifiedBy = adminId;

    // Set verificationRequired to false to indicate that verification is done
    report.verificationRequired = false;

    // Save the report with the updated verification status
    await report.save();

    // Return success response
    res.status(200).json({
      success: true,
      message: `Verification status updated to ${verificationStatus}`,
      report,
    });
  } catch (error) {
    console.error("Error updating verification status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update verification status",
    });
  }
};

// Update Report Status
exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId, status, resolutionDescription } = req.body;
    const adminId = req.user._id;

    if (!["RESOLVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report status",
      });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Ensure that the verification has been processed first
    if (report.verificationStatus === "PENDING") {
      return res.status(400).json({
        success: false,
        message:
          "Verification must be completed before updating the report status",
      });
    }

    // Update the report status
    report.reportStatus = status;
    report.resolvedAt = new Date();
    report.resolvedBy = adminId;
    report.resolutionDescription = resolutionDescription;

    await report.save();

    res.status(200).json({
      success: true,
      message: `Report status updated to ${status}`,
      report,
    });
  } catch (error) {
    console.error("Error updating report status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update report status",
    });
  }
};

// Get All Reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Reports Fetched Successfully",
      reports,
    });
  } catch (error) {
    console.error("Get all reports error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};
