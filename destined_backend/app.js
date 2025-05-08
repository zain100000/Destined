const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { initializeSocket } = require("./utilities/socket/socket");
const { initializeFriendRequestSocket } = require("./controllers/request.controller");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

// Initialize friend request socket handlers
initializeFriendRequestSocket(io);

// Middleware Setup
app.use(bodyParser.json({ limit: "20kb" }));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// CORS Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// Route Imports
const superAdminRoute = require("./routes/super-admin.route");
const userRoute = require("./routes/user.route");
const otpRoute = require("./routes/otp.route");
const interestRoute = require("./routes/interests.route");
const likingRoute = require("./routes/liking.route");
const matchingProfileRoute = require("./routes/profile-match.route");
const reportRoute = require("./routes/report.route");
const mediaRoute = require("./routes/media.route");
const chatRoute = require("./routes/chat.route");

// Route Mounting
app.use("/api/super-admin", superAdminRoute);
app.use("/api/user", userRoute);
app.use("/api/otp", otpRoute);
app.use("/api/interest", interestRoute);
app.use("/api/liking", likingRoute);
app.use("/api/profile-match", matchingProfileRoute);
app.use("/api/report", reportRoute);
app.use("/api/media", mediaRoute);
app.use("/api/chat", chatRoute);

// Database Connection and Server Startup
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });