const User = require("../models/userModel");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const saltround = 10;

// ==============================
// CREATE USER
// ==============================
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, saltround);

    // Profile image from multer
    let profilePic = "";

    if (req.file) {
      profilePic = req.file.path;
    }

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      profilePic,
    });

    await newUser.save();

    res.status(201).json({
      msg: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

// ==============================
// LOGIN
// ==============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const data = await User.findOne({ email });

    if (!data) {
      return res.status(404).json({
        msg: "No user registered",
      });
    }

    // Compare password
    const matchPassword = await bcrypt.compare(
      password,
      data.password
    );

    if (!matchPassword) {
      return res.status(401).json({
        msg: "Invalid password",
      });
    }

    // JWT token
    const token = jwt.sign(
      {
        id: data._id,
        name: data.username,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    // Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        _id: data._id,
        username: data.username,
        email: data.email,
        profilePic: data.profilePic,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

// ==============================
// LOGOUT
// ==============================
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    msg: "Logout successful",
  });
};

// ==============================
// SHOW USERS
// ==============================
const showUser = async (req, res) => {
  try {
    const data = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      msg: "All users",
      data,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server error",
    });
  }
};

module.exports = {
  createUser,
  login,
  logout,
  showUser,
};