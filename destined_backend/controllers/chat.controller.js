const Chat = require("../models/chat.model");
const { getIo } = require("../utilities/socket/socket");

exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    let chat = await Chat.findOne({
      $or: [
        {
          "participants.senderId": senderId,
          "participants.receiverId": receiverId,
        },
        {
          "participants.senderId": receiverId,
          "participants.receiverId": senderId,
        },
      ],
    });

    const newMessage = {
      senderId,
      receiverId,
      message,
      read: false,
      timestamp: new Date(),
    };

    if (!chat) {
      chat = new Chat({
        participants: { senderId, receiverId },
        messages: [newMessage],
      });
    } else {
      chat.messages.push(newMessage);
    }

    const savedChat = await chat.save();

    const io = getIo();
    if (io) {
      io.emit("newMessage", newMessage);
    }

    res.status(200).json({
      success: true,
      message: "Message Sent Successfully",
      Chat: {
        chatId: {
          _id: savedChat._id,
          participants: savedChat.participants,
          messages: savedChat.messages,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to save message",
      details: error.message,
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const chat = await Chat.findOne({
      $or: [
        {
          "participants.senderId": senderId,
          "participants.receiverId": receiverId,
        },
        {
          "participants.senderId": receiverId,
          "participants.receiverId": senderId,
        },
      ],
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "No Chat Found",
        chat: null,
      });
    }

    const response = {
      chatId: {
        _id: chat._id,
        participants: {
          senderId: chat.participants.senderId,
          receiverId: chat.participants.receiverId,
        },
        messages: chat.messages,
      },
    };

    res.status(200).json({
      success: true,
      message: "Chat Fetched Successfully",
      chat: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
