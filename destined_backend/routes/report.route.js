const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const documentUpload = require("../utilities/cloudinary/cloudinary.utility");
const reportController = require("../controllers/report.controller");

// Route for Submit Report
router.post("/submit-report", protect, reportController.submitReport);

// Route for Submit Verification Proof
router.post(
  "/submit-verification-proof",
  protect,
  documentUpload.upload,
  reportController.submitVerificationProof
);

// Route for Update Verification Status
router.patch(
  "/update-verification-status",
  protect,
  reportController.updateVerificationStatus
);

// Route for Update Report Status
router.patch(
  "/update-report-status",
  protect,
  reportController.updateReportStatus
);

// Route for Fetch Reports
router.get("/get-all-reports", protect, reportController.getAllReports);

module.exports = router;
