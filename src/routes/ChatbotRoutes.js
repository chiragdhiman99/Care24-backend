const express = require("express");
const router = express.Router();

const {getOrCreateChatbot,saveMessages} = require("../controllers/ChatbotController");

router.get("/:patientId", getOrCreateChatbot);
router.post("/:patientId", saveMessages);

module.exports = router;