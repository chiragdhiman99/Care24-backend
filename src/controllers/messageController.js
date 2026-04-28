const Messages = require("../models/Messages");

const createMessage = async (req, res) => {
  try {
    const { conversationId, senderId, senderType, content } = req.body;

    const newMessage = new Messages({
      conversationId,
      senderId,
      senderType,
      content,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
};

const getMessagesbyId = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const messages = await Messages.find({ conversationId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getunreadcounts = async (req, res) => {
    const { conversationId } = req.params;
    const count = await Messages.countDocuments({
        conversationId,
        isRead: false,
        senderType: "caregiver"
    });
    res.status(200).json({ count });
}

module.exports = { createMessage, getMessagesbyId , getunreadcounts};
