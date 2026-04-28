const Conversation = require("../models/Conversation");

const createConversation = async (req, res) => {
  try {
    const { patientId, caregiverId } = req.body;

    const existingConversation = await Conversation.findOne({
      patientId,
      caregiverId,
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }
    const newconversation = new Conversation({
      patientId,
      caregiverId,
    });

    await newconversation.save();
    res.status(201).json(newconversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
};

const getConversationbyUserId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const conversation = await Conversation.find({
      patientId,
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
};


const getConversationbyCaregiverId = async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const conversation = await Conversation.find({
      caregiverId,
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
}

module.exports = {
  createConversation,
  getConversationbyUserId,
  getConversationbyCaregiverId,
};
