const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
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

    // שדות חדשים
    birthDate: {
      type: Date,
      required: false,
    },

    idNumber: {
      type: String,
      required: false,
      trim: true,
    },

    address: {
      type: String,
      required: false,
      trim: true,
    },

    // תוכניות המאמן
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
