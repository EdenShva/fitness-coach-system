const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET /api/users/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/me
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { goalsText } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.userId,
      { goalsText },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/me/weekly-update", authMiddleware, async (req, res) => {
  try {
    const { weight, note } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "client") {
      return res.status(403).json({ message: "Only clients can add weekly updates" });
    }

    user.weeklyUpdates.push({ weight, note });
    await user.save();

    const safeUser = await User.findById(req.user.userId).select("-password");
    res.status(201).json(safeUser);
  } catch (err) {
    console.error("WEEKLY UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/client/:id/weekly-updates", authMiddleware, async (req, res) => {
  try {
    const coach = await User.findById(req.user.userId);
    if (!coach) return res.status(404).json({ message: "User not found" });

    if (coach.role !== "coach") {
      return res.status(403).json({ message: "Only coaches can view client updates" });
    }

    const client = await User.findById(req.params.id).select("-password");
    if (!client) return res.status(404).json({ message: "Client not found" });

    // MVP פשוט: המאמן יכול לראות כל לקוח (אח"כ אפשר להגביל לפי קשר)
    res.json({
      clientId: client._id,
      username: client.username,
      weeklyUpdates: client.weeklyUpdates || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
