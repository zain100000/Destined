const mongoose = require("mongoose");

// Define the schema for the SuperAdmin model
const superAdminSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
  },

  userName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isSuperAdmin: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
