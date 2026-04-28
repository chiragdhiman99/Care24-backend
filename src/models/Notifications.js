const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  type: { type: String },
  message: { type: String },
  caregiverName: { type: String },
  patientName: { type: String },
  serviceType: { type: String },
  totalAmount: { type: Number },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.index({ userId: 1 });
notificationSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
