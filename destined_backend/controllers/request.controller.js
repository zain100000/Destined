const mongoose = require("mongoose");
const User = require("../models/user.model");
const Request = require("../models/request.model");

const FRIEND_REQUEST_EVENTS = {
  // ======================
  // Events to EMIT (send)
  // ======================

  // Client emits to send a friend request
  SEND_REQUEST: "sendFriendRequest",

  // Client emits to accept a friend request
  ACCEPT_REQUEST: "acceptFriendRequest",

  // Client emits to reject a friend request
  REJECT_REQUEST: "rejectFriendRequest",

  // Client emits to get pending friend requests
  GET_PENDING_REQUESTS: "getPendingFriendRequests",

  // Client emits to get friends list
  GET_FRIENDS_LIST: "getFriendsList",

  // ======================
  // Events to LISTEN (receive)
  // ======================

  // Server emits when user receives a friend request
  RECEIVE_REQUEST: "receiveFriendRequest",

  // Server emits when a request is accepted
  REQUEST_ACCEPTED: "friendRequestAccepted",

  // Server emits when a request is rejected
  REQUEST_REJECTED: "friendRequestRejected",

  // Server emits the list of pending requests
  PENDING_REQUEST_LIST: "pendingFriendRequestList",

  // Server emits the friends list
  FRIENDS_LIST: "friendsList",
};

exports.initializeFriendRequestSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const sendError = (socket, message, details = null) => {
      const errorResponse = {
        success: false,
        message: message,
        ...(details && { details: details }),
      };
      console.log("Sending error:", errorResponse);
      socket.emit("error", errorResponse);
    };

    const sendSuccess = (socket, message, data = null) => {
      const successResponse = {
        success: true,
        message: message,
        ...(data && { data: data }),
      };
      console.log("Sending success:", successResponse);
      socket.emit("success", successResponse);
      return successResponse;
    };

    socket.on(FRIEND_REQUEST_EVENTS.SEND_REQUEST, async (data) => {
      console.log("SEND_REQUEST received:", data);
      try {
        const { senderId, receiverId } = data;

        if (
          !mongoose.Types.ObjectId.isValid(senderId) ||
          !mongoose.Types.ObjectId.isValid(receiverId)
        ) {
          return sendError(socket, "Invalid user ID provided");
        }

        if (socket.user.id !== senderId) {
          return sendError(socket, "Unauthorized to send this request");
        }

        const [sender, receiver] = await Promise.all([
          User.findById(senderId),
          User.findById(receiverId),
        ]);

        if (!sender || !receiver) {
          return sendError(socket, "One or both users not found");
        }

        const existingRequest = await Request.findOne({
          $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
          ],
        });

        if (existingRequest) {
          if (existingRequest.status === "PENDING") {
            return sendError(socket, "Friend request already pending");
          } else {
            return sendError(socket, "You are already friends with this user");
          }
        }

        const newRequest = new Request({
          sender: senderId,
          receiver: receiverId,
          status: "PENDING",
        });
        await newRequest.save();

        console.log("New friend request saved:", newRequest);

        const responseData = {
          requestId: newRequest._id,
          sender,
          receiver,
          status: newRequest.status,
          createdAt: newRequest.createdAt,
        };

        sendSuccess(socket, "Friend request sent successfully", responseData);

        io.to(receiverId).emit(FRIEND_REQUEST_EVENTS.RECEIVE_REQUEST, {
          success: true,
          message: "You have received a new friend request",
          data: {
            requestId: newRequest._id,
            sender,
            createdAt: newRequest.createdAt,
          },
        });

        console.log("Friend request event emitted to receiver:", receiverId);
      } catch (error) {
        console.error("SEND_REQUEST error:", error.message);
        sendError(socket, "Failed to send friend request", error.message);
      }
    });

    socket.on(FRIEND_REQUEST_EVENTS.ACCEPT_REQUEST, async (data) => {
      console.log("ACCEPT_REQUEST received:", data);
      try {
        const { requestId, senderId, receiverId } = data;

        if (
          !mongoose.Types.ObjectId.isValid(requestId) ||
          !mongoose.Types.ObjectId.isValid(senderId) ||
          !mongoose.Types.ObjectId.isValid(receiverId)
        ) {
          return sendError(socket, "Invalid ID provided");
        }

        if (socket.user.id !== receiverId) {
          return sendError(socket, "Unauthorized to accept this request");
        }

        const request = await Request.findById(requestId);
        if (!request) {
          return sendError(socket, "Friend request not found");
        }

        if (request.status !== "PENDING") {
          return sendError(
            socket,
            `Request has already been ${request.status.toLowerCase()}`
          );
        }

        request.status = "ACCEPTED";
        await request.save();

        const [sender, receiver] = await Promise.all([
          User.findById(senderId),
          User.findById(receiverId),
        ]);

        if (!sender || !receiver) {
          return sendError(socket, "One or both users not found");
        }

        if (
          !receiver.friends.includes(senderId) &&
          !sender.friends.includes(receiverId)
        ) {
          receiver.friends.push(senderId);
          sender.friends.push(receiverId);
          await Promise.all([receiver.save(), sender.save()]);
        }

        const responseData = {
          requestId: request._id,
          friendship: {
            user1: sender,
            user2: receiver,
            establishedAt: new Date(),
          },
        };

        sendSuccess(
          socket,
          "Friend request accepted successfully",
          responseData
        );

        io.to(senderId).emit(FRIEND_REQUEST_EVENTS.REQUEST_ACCEPTED, {
          success: true,
          message: "Your friend request has been accepted",
          data: {
            requestId: request._id,
            friend: receiver,
          },
        });

        console.log("Friendship established between:", senderId, receiverId);
      } catch (error) {
        console.error("ACCEPT_REQUEST error:", error.message);
        sendError(socket, "Failed to accept friend request", error.message);
      }
    });

    socket.on(FRIEND_REQUEST_EVENTS.REJECT_REQUEST, async (data) => {
      console.log("REJECT_REQUEST received:", data);
      try {
        const { requestId, senderId, receiverId } = data;

        if (
          !mongoose.Types.ObjectId.isValid(requestId) ||
          !mongoose.Types.ObjectId.isValid(senderId) ||
          !mongoose.Types.ObjectId.isValid(receiverId)
        ) {
          return sendError(socket, "Invalid ID provided");
        }

        if (socket.user.id !== receiverId) {
          return sendError(socket, "Unauthorized to reject this request");
        }

        const request = await Request.findOneAndDelete({
          _id: requestId,
          status: "PENDING",
        });

        if (!request) {
          return sendError(socket, "Pending friend request not found");
        }

        sendSuccess(socket, "Friend request rejected successfully", {
          requestId: request._id,
        });

        io.to(senderId).emit(FRIEND_REQUEST_EVENTS.REQUEST_REJECTED, {
          success: true,
          message: "Your friend request has been rejected",
          data: {
            requestId: request._id,
          },
        });

        console.log("Friend request rejected:", requestId);
      } catch (error) {
        console.error("REJECT_REQUEST error:", error.message);
        sendError(socket, "Failed to reject friend request", error.message);
      }
    });

    socket.on(FRIEND_REQUEST_EVENTS.GET_PENDING_REQUESTS, async (userId) => {
      console.log("GET_PENDING_REQUESTS received for user:", userId);
      try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return sendError(socket, "Invalid user ID provided");
        }

        if (socket.user.id !== userId) {
          return sendError(socket, "Unauthorized to view these requests");
        }

        const [incomingRequests, outgoingRequests] = await Promise.all([
          Request.find({ receiver: userId, status: "PENDING" })
            .populate("sender")
            .sort({ createdAt: -1 }),
          Request.find({ sender: userId, status: "PENDING" })
            .populate("receiver")
            .sort({ createdAt: -1 }),
        ]);

        const responseData = {
          incoming: incomingRequests.map((req) => ({
            requestId: req._id,
            sender: req.sender,
            createdAt: req.createdAt,
          })),
          outgoing: outgoingRequests.map((req) => ({
            requestId: req._id,
            receiver: req.receiver,
            createdAt: req.createdAt,
          })),
        };

        socket.emit(FRIEND_REQUEST_EVENTS.PENDING_REQUEST_LIST, {
          success: true,
          message: "Pending friend requests retrieved successfully",
          data: responseData,
        });

        console.log("Pending requests retrieved for user:", userId);
      } catch (error) {
        console.error("GET_PENDING_REQUESTS error:", error.message);
        sendError(socket, "Failed to retrieve pending requests", error.message);
      }
    });

    socket.on(FRIEND_REQUEST_EVENTS.GET_FRIENDS_LIST, async (userId) => {
      console.log("GET_FRIENDS_LIST received for user:", userId);
      try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return sendError(socket, "Invalid user ID provided");
        }

        if (socket.user.id !== userId) {
          return sendError(socket, "Unauthorized to view this friends list");
        }

        const user = await User.findById(userId).populate("friends");

        if (!user) {
          return sendError(socket, "User not found");
        }

        const responseData = {
          userId: user._id,
          friends: user.friends,
          count: user.friends.length,
        };

        socket.emit(FRIEND_REQUEST_EVENTS.FRIENDS_LIST, {
          success: true,
          message: "Friends list retrieved successfully",
          data: responseData,
        });

        console.log("Friends list sent for user:", userId);
      } catch (error) {
        console.error("GET_FRIENDS_LIST error:", error.message);
        sendError(socket, "Failed to retrieve friends list", error.message);
      }
    });
  });
};
