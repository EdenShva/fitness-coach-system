const Mongooose = require("mongoose");
const UserSchema = new Mongooose.Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true,
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
    },
    { timestamps: true }
);
module.exports = Mongooose.model("User", UserSchema);