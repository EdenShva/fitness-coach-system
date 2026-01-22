const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// כל משתמש מחובר
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You have accessed a protected route", user: req.user });
});

// רק מאמן
router.get(
  "/coach-only",
  authMiddleware,
  roleMiddleware("coach"),
  (req, res) => {
    res.json({ message: "Welcome Coach! You have access to this route." });
  }
);

module.exports = router;
