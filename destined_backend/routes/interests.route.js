const express = require("express");
const router = express.Router();
const getInterests = require("../controllers/interests.controller");

// Route to get interests
router.get("/get-all-interests", getInterests.getInterests);

module.exports = router;
