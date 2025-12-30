const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware"); 
const Client = require("../models/Client");

const router = express.Router();

// יצירת לקוח חדש על ידי מאמן
router.post(
  "/clients",
  authMiddleware,
  roleMiddleware("coach"),
  async (req, res) => {
    try {
      const { name, goals, notes } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Client name is required" });
      }

        const newClient = new Client({
            name,
            goals,
            notes,
            coach: req.user.userId,
        });
        await newClient.save();
        res.status(201).json({
            message: "Client created successfully", 
            client: newClient 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;