const express = require("express");

const userRouter = express.Router();

const userController = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");

const upload = require("../middlewares/multerMiddleware");

// ==============================
// AUTH ROUTES
// ==============================

// Register user with profile image
userRouter.post("/createuser",upload.single("profilePic"),userController.createUser);

// Login
userRouter.post("/login",userController.login);

// Logout
userRouter.post("/logout",userController.logout);

// ==============================
// USER ROUTES
// ==============================

// Show all users
userRouter.get("/showuser",authMiddleware,userController.showUser);

module.exports = userRouter;