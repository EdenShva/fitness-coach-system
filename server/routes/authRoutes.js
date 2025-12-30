const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

// REGISTER – יצירת משתמש חדש
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // בדיקות בסיסיות
    if (!username || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // הצפנת סיסמה
    const hashedPassword = await bcrypt.hash(password, 10);

    // יצירת משתמש חדש
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN – נכתוב בשלב הבא
router.post("/login", (req, res) => {
  res.json({ message: "Login route (next step)" });
});

module.exports = router;
