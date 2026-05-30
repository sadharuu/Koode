const Message = require("../models/messageModel");
const cloudinary=require("../config/cloudinary");

// ==============================
// SEND TEXT MESSAGE
// ==============================
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const image = req.file ? req.file.path : ""; // or however you extract the image string

    if (!message && !image) {
      return res.status(400).json({ error: "Cannot send an empty message." });
    }

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
// ==============================
// UPLOAD IMAGE MESSAGE
// ==============================
const uploadImage = async (req, res) => {
  try {
    console.log("REQ FILE RECEIVED:", req.file);
    console.log("REQ BODY RECEIVED:", req.body);

    const { senderId, receiverId } = req.body;

    // 1. Validate fields
    if (!senderId || !receiverId) {
      return res.status(400).json({
        msg: "SenderId and ReceiverId are required fields.",
      });
    }

    // 2. Validate file existence
    if (!req.file) {
      return res.status(400).json({
        msg: "No image file provided.",
      });
    }

    // 3. Upload file to Cloudinary
    // Note: If your multer setup uses memoryStorage, use req.file.buffer. 
    // If it uses diskStorage, use req.file.path.
    const fileToUpload = req.file.path || req.file.buffer; 
    
    const cloudinaryResponse = await cloudinary.uploader.upload(fileToUpload, {
      folder: "chat_images", // Optional: organizes your images in Cloudinary
    });

    // 4. Save the Cloudinary secure URL to MongoDB
    const newMessage = await Message.create({
      senderId,
      receiverId,
      image: cloudinaryResponse.secure_url, // Save the actual internet URL!
      message: "",
    });

    res.status(200).json({
      msg: "Image uploaded and sent successfully",
      data: newMessage,
    });

  } catch (error) {
    // Separation by comma ensures Node prints the full error stack trace, not [object Object]
    console.error("Upload Error Details:", error); 

    res.status(500).json({
      msg: "Server error during image upload",
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