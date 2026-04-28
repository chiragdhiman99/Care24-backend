const Caregiver = require("../models/Caregiver");
const Messages = require("../models/Messages");
const User = require("../models/User");
const Notifications = require("../models/Notifications");
const { getIO } = require("../utils/socket");

const getCaregivers = async (req, res) => {
  try {
    const caregivers = await Caregiver.find({});
    res.status(200).json(caregivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCaregiverbyId = async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id);
    res.status(200).json(caregiver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCaregiverStatus = async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    res.status(200).json(caregiver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateCaregiverProfile = async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, upsert: true },
    );

    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await Notifications.create({
        userId: admin._id,
        type: "caregiver_update",
        message: `Caregiver ${caregiver.name} has updated their profile — review & approve`,
        serviceType: "Caregiver Profile",
        totalAmount: 0,
      });

      const io = getIO();
      io.emit("caregiverUpdate", {
        type: "caregiver_update",
        message: `Caregiver ${caregiver.name} has updated their profile — review & approve`,
        serviceType: "Caregiver Profile",
        totalAmount: 0,
        createdAt: new Date(),
        isRead: false,
      });
    }

    res.status(200).json(caregiver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCaregivers,
  getCaregiverbyId,
  updateCaregiverStatus,
  updateCaregiverProfile,
};
