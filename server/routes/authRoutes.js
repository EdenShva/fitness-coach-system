// routes/authRoutes.js
// Registration & login routes

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Client = require("../models/Client"); // 👈 חשוב: נוסיף גם את המודל Client

const router = express.Router();

// REGISTER (clients can register themselves)
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      birthDate,
      idNumber,
      address,
    } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // לא מאפשרים הרשמה של מאמן מהמסך הזה – רק client
    if (role !== "client") {
      return res
        .status(400)
        .json({ message: "Only clients can register from this form" });
    }

    // בדיקה אם משתמש כבר קיים
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // הצפנת סיסמה
    const hashedPassword = await bcrypt.hash(password, 10);

    // יצירת משתמש חדש (User)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "client",
      birthDate: birthDate ? new Date(birthDate) : undefined,
      idNumber,
      address,
    });

    await newUser.save();

    // 🔥 פה הקסם: יוצרים גם Client שקשור למאמן כלשהו

    // מחפשים מאמן אחד במערכת (בהנחה שיש מאמן יחיד – המורה / את)
    const coach = await User.findOne({ role: "coach" });

    if (!coach) {
      // אין מאמן במערכת – עדיין נרשום את הלקוח כ-User בלבד
      console.warn("No coach user found. Client created without coach link.");
    } else {
      const newClient = new Client({
        name: username,
        goals: "",
        notes: "",
        coach: coach._id,     // 👈 משייכים למאמן
        user: newUser._id,    // 👈 קישור ל-User
      });

      await newClient.save();
    }

    return res.status(201).json({
      message: "Client registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (coach or client)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // email or username in "email" field

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // מחפשים לפי email או username
    const user = await User.findOne({
      $or: [{ email }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role: user.role,
      userId: user._id,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
