const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["coach", "client"],
    required: true,
  },

  // טקסט חופשי של מטרות / פידבק
  goalsText: {
    type: String,
    default: "",
  },

  // היסטוריה שבועית
  weeklyUpdates: [
    {
      date: { type: Date, default: Date.now },
      weight: { type: Number },
      note: { type: String, default: "" },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);