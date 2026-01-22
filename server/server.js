// server.js
// Main Express server setup

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const clientRoutes = require("./routes/clientRoutes");
const userRoutes = require("./routes/userRoutes");
const coachRoutes = require("./routes/coachRoutes");

const app = express();

// connect to database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);

// בדיקת חיבור בסיסית
app.get("/", (req, res) => {
  res.send("Server is running and connected to MongoDB");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
