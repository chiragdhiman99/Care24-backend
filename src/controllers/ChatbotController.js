const Chatbot = require("../models/Chatbot");

const getOrCreateChatbot = async (req, res) => {
  try {
    const { patientId } = req.params;

    let chatbot = await Chatbot.findOne({ patientId });

    if (!chatbot) {
      chatbot = new Chatbot({ patientId, messages: [] });
      await chatbot.save();
    }

    res.status(200).json(chatbot);
  } catch (error) {
    res.status(500).json({ error: "Failed to get or create chatbot" });
  }
};


const saveMessages = async (req, res) => {
  try {
    const { patientId } = req.params;
    const {role, content } = req.body;

    const chatbot = await Chatbot.findOne({ patientId });

    if (!chatbot) {
      return res.status(404).json({ error: "Chatbot not found" });
    }

    chatbot.messages.push({ role, content });
    await chatbot.save();

    res.status(200).json(chatbot);
  } catch (error) {
    res.status(500).json({ error: "Failed to save message" });
  }
};


module.exports = { getOrCreateChatbot , saveMessages};
