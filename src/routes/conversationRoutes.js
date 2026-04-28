const express = require("express");
const router = express.Router();

const {
  createConversation,
  getConversationbyUserId,
  getConversationbyCaregiverId,
} = require("../controllers/conversationController");

router.post("/create", createConversation);
router.get("/:patientId", getConversationbyUserId);
router.get("/caregiver/:caregiverId", getConversationbyCaregiverId);
module.exports = router;
