const Message = require("../models/messageModel");

// ==============================
// UPLOAD IMAGE MESSAGE
// ==============================
const uploadImage = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const { senderId, receiverId } = req.body;

    // 1. Validation for Required Fields
    if (!senderId || !receiverId) {
      return res.status(400).json({
        msg: "Validation failed: senderId and receiverId are required.",
      });
    }

    // 2. Check if file was parsed successfully by Multer
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        msg: "No image file uploaded or Cloudinary upload failed.",
      });
    }

    // 3. Create document in database using Cloudinary URL (req.file.path)
    const newMessage = await Message.create({
      senderId,
      receiverId,
      image: req.file.path, // This is the Cloudinary secure URL string
      message: "", // Empty string since schema allows it now
    });

    res.status(200).json({
      msg: "Image uploaded successfully",
      data: newMessage,
    });
  } catch (error) {
    // Stringify or log separated to prevent [object Object] output
    console.error("CRITICAL EXCEPTION IN UPLOADIMAGE CONTROLLER:");
    console.error(error);

    res.status(500).json({
      msg: "Server error during file handling",
      error: error.message || "Unknown error context",
    });
  }
};

// ==============================
// SEND TEXT MESSAGE
// ==============================
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

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
    console.error("Send Message Error:", error);
    res.status(500).json({ msg: "Server error" });
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
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      msg: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    res.status(500).json({ msg: "Server error", data: [] });
  }
};

// ==============================
// DELETE MESSAGE
// ==============================
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ msg: "Message not found" });
    }

    res.status(200).json({ msg: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  sendMessage,
  showMessage,
  deleteMessage,
  uploadImage,
};