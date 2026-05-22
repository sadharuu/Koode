const { Server } = require("socket.io");


const onlineUsers = new Map();

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://koode-gamma.vercel.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // ==============================
    // Register user when they login
    // Frontend:
    // socket.emit("addUser", userId);
    // ==============================
    socket.on("addUser", (userId) => {
      if (!userId) return;

      // Save userId -> socketId
      onlineUsers.set(userId.toString(), socket.id);

      console.log("Online Users:", Array.from(onlineUsers.keys()));

      // Send updated online users list to all clients
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });

    // ==============================
    // Real-time message delivery
    // Frontend:
    // socket.emit("sendMessage", {
    //   senderId,
    //   receiverId,
    //   message,
    //   createdAt
    // });
    // ==============================
    socket.on("sendMessage", (data) => {
      try {
        const { senderId, receiverId, message } = data;

        console.log("New Message:");
        console.log("From:", senderId);
        console.log("To:", receiverId);
        console.log("Message:", message);

        // Find receiver's socket
        const receiverSocketId = onlineUsers.get(receiverId.toString());

        // If receiver is online, send message instantly
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", data);
          console.log(
            `Message delivered to ${receiverId} (${receiverSocketId})`
          );
        } else {
          console.log(`User ${receiverId} is offline`);
        }

        // Optional: send confirmation back to sender
        socket.emit("messageSent", data);
      } catch (error) {
        console.error("Socket sendMessage error:", error);
      }
    });

    // ==============================
    // Typing indicator
    // ==============================
    socket.on("typing", ({ receiverId, senderName }) => {
      const receiverSocketId = onlineUsers.get(receiverId?.toString());

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          senderName,
        });
      }
    });

    // ==============================
    // Stop typing indicator
    // ==============================
    socket.on("stopTyping", ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(receiverId?.toString());

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userStopTyping");
      }
    });

    // ==============================
    // Disconnect
    // ==============================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove disconnected user
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      // Broadcast updated online users
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

module.exports = initializeSocket;