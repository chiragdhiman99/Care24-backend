// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },

    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    caregiverExperience: { type: String },
    caregiverRating: { type: Number },
    caregiverReviews: { type: Number },
    caregiverAvailable: { type: Boolean },

    caregiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caregiver",
      required: true,
    },
    caregiverName: {
      type: String,
      required: true,
    },

    patientName: {
      type: String,
      required: true,
    },
    patientAge: {
      type: Number,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    patientGender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: {
      type: String,
    },
    notes: {
      type: String,
      default: "",
    },

    serviceType: {
      type: String,
      enum: ["Hourly", "Daily", "Weekly"],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayOrderId: {
      type: String,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "failed", "pending"],
      default: "paid",
    },

    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ userId: 1 });
bookingSchema.index({ caregiverId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
