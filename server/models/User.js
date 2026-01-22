// models/User.js
// User model - used for both coach and client login

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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

    trainingPlan: {
      type: String,
      default: "",
    },

    nutritionPlan: {
      type: String,
      default: "",
    },

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
  }
);

module.exports = mongoose.model("User", userSchema);
