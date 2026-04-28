const Notifications = require("../models/Notifications");
const User = require("../models/User");

const createNotification = async (req, res) => {
  try {
    const {
      userId,
      bookingId,
      type,
      message,
      caregiverName,
      serviceType,
      totalAmount,
    } = req.body;
    const notification = new Notifications({
      userId,
      bookingId,
      type,
      message,
      caregiverName,
      serviceType,
      totalAmount,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notifications.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to get notifications" });
  }
};

const markAllAsRead3 = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notifications.updateMany({ userId }, { isRead: true });
    res.status(200).json({ message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
};

module.exports = { createNotification, getNotifications, markAllAsRead3 };

