const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const authMiddleware = require("../middleware/authMiddleware");

// יצירת לקוח חדש
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, goals, notes } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newClient = new Client({
      name,
      goals: goals || "",
      notes: notes || "",
      coach: req.user.userId, // המאמן מתוך הטוקן
    });

    await newClient.save();
    res.status(201).json(newClient);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// קבלת כל הלקוחות של המאמן
router.get("/", authMiddleware, async (req, res) => {
  try {
    const clients = await Client.find({ coach: req.user.userId });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// בקבלת לקוח לפי id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      coach: req.user.userId, // לוודא שהמאמן רואה רק את הלקוחות שלו
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// עדכון לקוח לפי id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, goals, notes } = req.body;

    // אפשר בהמשך להוסיף ולידציות, למשל: אם name ריק → שגיאה
    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id, coach: req.user.userId }, // רק לקוח של המאמן המחובר
      { name, goals, notes },
      { new: true, runValidators: true } // new:true מחזיר את הלקוח המעודכן
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


