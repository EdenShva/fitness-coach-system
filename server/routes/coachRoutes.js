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


// קבלת כל הלקוחות של המאמן
router.get(
    "/clients",
    authMiddleware,
    roleMiddleware("coach"),
    async (req, res) => {
      try {
        const clients = await Client.find({ coach: req.user.userId,
         }).sort({ createdAt: -1 });
        res.json({ clients });
      } catch (error) {
        res.status(500).json({ message: error.message });
      } 
    }
);

// קבלת לקוח לפי ID (מאמן בלבד)
router.get(
  "/clients/:id",
  authMiddleware,
  roleMiddleware("coach"),
  async (req, res) => {
    try {
      const client = await Client.findById(req.params.id);

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      // בדיקה שהלקוח שייך למאמן המחובר
      if (client.coach.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// עדכון לקוח לפי ID (מאמן בלבד)
router.put(
  "/clients/:id",
  authMiddleware,
  roleMiddleware("coach"),
  async (req, res) => {
    try {
      const { name, goals, notes } = req.body;

      const client = await Client.findById(req.params.id);

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      // בדיקה שהלקוח שייך למאמן המחובר
      if (client.coach.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // עדכון שדות (רק אם נשלחו)
      if (name !== undefined) client.name = name;
      if (goals !== undefined) client.goals = goals;
      if (notes !== undefined) client.notes = notes;

      await client.save();

      res.json({
        message: "Client updated successfully",
        client,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// מחיקת לקוח לפי ID (מאמן בלבד)
router.delete(
  "/clients/:id",
  authMiddleware,
  roleMiddleware("coach"),
  async (req, res) => {
    try {
      const client = await Client.findById(req.params.id);

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      // בדיקה שהלקוח שייך למאמן המחובר
      if (client.coach.toString() !== req.user.userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      await client.deleteOne();

      res.json({ message: "Client deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


module.exports = router;