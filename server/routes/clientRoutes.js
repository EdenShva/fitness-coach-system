const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Client = require("../models/Client");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// יצירת לקוח חדש
// POST /api/clients  (Coach creates a client + optional login user)
router.post("/", authMiddleware, async (req, res) => {
  try {
    // לוודא שרק מאמן יכול ליצור לקוחות
    if (req.user.role !== "coach") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, goals, notes, username, password } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // אם מתחילים ליצור משתמש לוגין – חייבים גם username וגם password
    if ((username && !password) || (!username && password)) {
      return res
        .status(400)
        .json({
          message:
            "If you want to create a login for the client, please provide BOTH username and password",
        });
    }

    let createdUser = null;

    if (username && password) {
      // לבדוק שאין כבר משתמש כזה
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      createdUser = await User.create({
        username,
        password: hashedPassword,
        role: "client",
        goalsText: "", // אפשר להשאיר ריק בשלב הראשון
      });
    }

    const newClient = await Client.create({
      name,
      goals: goals || "",
      notes: notes || "",
      coach: req.user.userId, // המאמן מתוך הטוקן
      user: createdUser ? createdUser._id : undefined, // 👈 הקישור החשוב ל-User
    });

    res.status(201).json(newClient);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// קבלת כל הלקוחות של המאמן
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "coach") {
      return res.status(403).json({ message: "Access denied" });
    }

    const clients = await Client.find({ coach: req.user.userId });
    res.json(clients);
  } catch (error) {
    console.error("Error getting clients:", error);
    res.status(500).json({ message: error.message });
  }
});

// קבלת לקוח לפי id (Client id, לא User)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "coach") {
      return res.status(403).json({ message: "Access denied" });
    }

    const client = await Client.findOne({
      _id: req.params.id,
      coach: req.user.userId, // לוודא שהמאמן רואה רק את הלקוחות שלו
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("Error getting client:", error);
    res.status(500).json({ message: error.message });
  }
});

// עדכון לקוח לפי id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "coach") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, goals, notes } = req.body;

    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id, coach: req.user.userId }, // רק לקוח של המאמן המחובר
      { name, goals, notes },
      { new: true, runValidators: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ message: error.message });
  }
});

// מחיקת לקוח לפי id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "coach") {
      return res.status(403).json({ message: "Access denied" });
    }

    const deletedClient = await Client.findOneAndDelete({
      _id: req.params.id,
      coach: req.user.userId,
    });

    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
