const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const testRoutes = require("./routes/testRoutes");

const coachRoutes = require("./routes/coachroutes");

const app = express();

// חיבור למסד הנתונים
connectDB();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/coach", coachRoutes);

const clientRoutes = require("./routes/clientRoutes");
app.use("/api/clients", clientRoutes);

// בדיקת חיבור בסיסית
app.get("/", (req, res) => {
  res.send("Server is running and connected to MongoDB");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
