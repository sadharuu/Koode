const Message = require("../models/messageModel");
const cloudinary=require("../config/cloudinary");

// ==============================
// SEND TEXT MESSAGE
// ==============================
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    // Validation
    if (!senderId || !receiverId || !message) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    res.status(201).json({
      msg: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.log("Send Message Error:", error);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

// ==============================
// SHOW MESSAGES
// ==============================
const showMessage = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      msg: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.log("Fetch Messages Error:", error);

    res.status(500).json({
      msg: "Server error",
      data: [],
    });
  }
};

// ==============================
// DELETE MESSAGE
// ==============================
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMessage =
      await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({
        msg: "Message not found",
      });
    }

    res.status(200).json({
      msg: "Message deleted successfully",
    });
  } catch (error) {
    console.log("Delete Message Error:", error);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

// ==============================
// UPLOAD IMAGE MESSAGE
// ==============================
const uploadImage = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        msg: "No image uploaded",
      });
    }

    // Image already uploaded to Cloudinary
    const imageUrl = req.file.path;
    console.log("REQ FILE:", req.file);
    console.log("REQ BODY:", req.body);

    const newMessage = await Message.create({
      senderId,
      receiverId,
      image: imageUrl,
      message: "",
    });

    res.status(200).json({
      msg: "Image uploaded successfully",
      data: newMessage,
    });
  } catch (error) {
    console.log("Upload Error:", error);

    res.status(500).json({
      msg: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  showMessage,
  deleteMessage,
  uploadImage,
};