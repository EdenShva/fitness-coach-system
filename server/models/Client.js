const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        goals: {
            type: String,
            default: "",
        },
        notes: {
            type: String,
            default: "",    
        }, 
        coach: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true, 
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);