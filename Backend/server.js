const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');

const connectDB = require("./config/db");
const initializeSocket = require("./sockets/socket");

const messageRoute = require("./routes/messageRoute");
const userRoute = require("./routes/userRoute");

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser());

// Middleware
app.use(cors({
  origin: "https://koode-gamma.vercel.app", // Frontend URL
  credentials: true,
}));
app.use(morgan("dev"));


// Routes
app.use("/message", messageRoute);
app.use("/user", userRoute);

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Optional: make io available in controllers/routes
app.set("io", io);

// Port
const PORT = process.env.PORT || 3000;

// Start server using server.listen (not app.listen)
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
