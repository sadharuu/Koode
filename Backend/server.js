require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

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
// GLOBAL ERROR HANDLER (Add at the very end of server.js)
// ==============================
app.use((err, req, res, next) => {
  // 1. Force the server logs to print the full stack trace object properly
  console.error("--- GLOBAL ERROR INTERCEPTED ---");
  console.error(err); 

  // 2. Prevent sending [object Object] to the frontend by forcing a clean JSON string
  res.status(500).json({
    msg: "An internal server error occurred in the middleware layer.",
    error: err.message || "No error message provided",
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack // Hides stack trace in production for security
  });
});

// ==============================
// START SERVER
// ==============================
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});