const express = require("express");

const messageRouter = express.Router();

const upload = require("../middlewares/multerMiddleware");

const messageController = require("../controllers/messageController");

// ==============================
// IMAGE MESSAGE UPLOAD
// ==============================
messageRouter.post(
  "/uploadimage",
  upload.single("image"),
  messageController.uploadImage
);

// ==============================
// TEXT MESSAGE
// ==============================
messageRouter.post(
  "/sendmessage",
  messageController.sendMessage
);

// ==============================
// SHOW CHAT
// ==============================
messageRouter.get(
  "/showmessage/:senderId/:receiverId",
  messageController.showMessage
);

// ==============================
// DELETE MESSAGE
// ==============================
messageRouter.delete(
  "/deletemessage/:id",
  messageController.deleteMessage
);

module.exports = messageRouter;