const express = require("express");
const router = express.Router();
const { createNotification,getNotifications,markAllAsRead3} = require("../controllers/NotificationsController");

router.post("/", createNotification);
router.get("/all/:userId", getNotifications);
router.put("/read/:userId", markAllAsRead3);

module.exports = router;