const mongoose = require("mongoose");

const chatbotSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: [
        {
            role: {
                type: String,
                enum: ["user", "bot"],
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model("Chatbot", chatbotSchema);