const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/db");
const initializeSocket = require("./sockets/socket");

require("dotenv").config();

const express = require("express");
const http = require("http");

const messageRoute = require("./routes/messageRoute");
const userRoute = require("./routes/userRoute");



// ==============================
// CREATE APP
// ==============================
const app = express();

// ==============================
// CONNECT DATABASE
// ==============================
connectDB();

// ==============================
// MIDDLEWARE
// ==============================
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://koode-gamma.vercel.app",
    ],
    credentials: true,
  })
);

app.use(morgan("dev"));


// ==============================
// ROUTES
// ==============================
app.use("/message", messageRoute);

app.use("/user", userRoute);

// ==============================
// CREATE HTTP SERVER
// ==============================
const server = http.createServer(app);

// ==============================
// INITIALIZE SOCKET.IO
// ==============================
const io = initializeSocket(server);

// Optional
app.set("io", io);



// ==============================
// PORT
// ==============================
const PORT = process.env.PORT || 3000;

// ==============================
// START SERVER
// ==============================
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});