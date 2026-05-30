const express = require("express");
const messageRouter = express.Router();
const upload = require("../middleware/multerMiddleware"); // Adjust this path to your middleware location
const { uploadImage, sendMessage, showMessage, deleteMessage } = require("../controllers/messageController");

// The key inside single() MUST match your frontend FormData field key name (e.g., formData.append('image', file))
messageRouter.post("/uploadimage", upload.single("image"), uploadImage);

messageRouter.post("/sendmessage", sendMessage);
messageRouter.get("/showmessage/:senderId/:receiverId", showMessage);
messageRouter.delete("/deletemessage/:id", deleteMessage);

module.exports = messageRouter;