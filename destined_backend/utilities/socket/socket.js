const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  // JWT authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.query.token;

    if (!token) {
      console.error("No token provided for socket", socket.id);
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded.user;

      next();
    } catch (error) {
      console.error(
        "JWT verification error for socket",
        socket.id,
        ":",
        error.message
      );
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.user && socket.user.id) {
      socket.join(socket.user.id);
    }

    socket.on("disconnect", (reason) => {});

    socket.on("error", (error) => {});
  });

  return io;
};

const getIo = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initializeSocket, getIo };
