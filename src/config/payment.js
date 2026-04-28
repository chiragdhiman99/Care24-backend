const razorpay = require("razorpay");
const router = require("express").Router();
const crypto = require("crypto");
const sendBookingConfirmationEmail = require("../utils/sendBookingEmail");
const Booking = require("../models/booking");
const Caregiver = require("../models/Caregiver");
const Conversation = require("../models/Conversation");
const Notifications = require("../models/Notifications");
const User = require("../models/User");

const { getIO } = require("../utils/socket");

const instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await instance.orders.create(options);
    res.status(200).json({ order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.post("/verify-payment", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    toEmail,
    userId,
    caregiverId,
    caregiverName,
    patientName,
    patientAge,
    patientGender,
    caregiverExperience,
    caregiverRating,
    caregiverReviews,
    caregiverAvailable,
    address,
    notes,
    service,
    startTime,
    date,
    duration,
    totalAmount,
    bookingId,
    method,
    transactionId,
  } = req.body;

  const signature = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(signature)
    .digest("hex");

  if (razorpay_signature === expectedSignature) {
    try {
      const booking = new Booking({
        userId,
        userEmail: toEmail,
        bookingId,
        caregiverId,
        caregiverName,
        patientName,
        patientAge,
        caregiverExperience,
        patientGender,
        address,
        notes,
        serviceType: service,
        date,
        caregiverRating,
        caregiverReviews,
        caregiverAvailable,
        duration,
        startTime: new Date(startTime),
        totalAmount,
        paymentMethod: method || "UPI",
        transactionId: transactionId || razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        paymentStatus: "paid",
        status: "confirmed",
      });
      await booking.save();

      const existingConversation = await Conversation.findOne({
        patientId: userId,
        caregiverId: caregiverId,
      });
      if (!existingConversation) {
        await new Conversation({ patientId: userId, caregiverId }).save();
      }

      await Caregiver.findByIdAndUpdate(caregiverId, {
        status: "booked",
        available: false,
      });

      const io = getIO();

      io.to(userId).emit("newBooking", {
        type: "booking_confirmed",
        message: `Your booking with ${caregiverName} is confirmed for ${date}`,
        bookingId,
        caregiverName,
        serviceType: service,
        totalAmount,
        createdAt: new Date(),
        isRead: false,
      });
      await Notifications.create({
        userId,
        bookingId: booking._id,
        type: "booking_confirmed",
        message: `Your booking with ${caregiverName} is confirmed for ${date}`,
        caregiverName,
        serviceType: service,
        totalAmount,
      });

      const admin = await User.findOne({ role: "admin" });
      io.emit("newBooking", {
        type: "new_booking",
        message: `New booking from ${patientName}`,
        patientName,
        serviceType: service,
        totalAmount,
        createdAt: new Date(),
        isRead: false,
      });
      await Notifications.create({
        userId: admin._id,
        bookingId: booking._id,
        type: "new_booking",
        message: `New booking from ${patientName}`,
        patientName,
        serviceType: service,
        totalAmount,
      });

      const caregiver = await Caregiver.findById(caregiverId);
      const caregiverUser = await User.findOne({ email: caregiver.email });

      if (caregiverUser?.notificationPreferences?.newClientRequests) {
        io.to(caregiverId).emit("newBooking", {
          caregiverId,
          caregiverName,
          clientName: patientName,
          patientName,
          service,
          serviceType: service,
          date,
          duration,
          totalAmount,
          bookingId,
        });
        await Notifications.create({
          userId: caregiverId,
          bookingId: booking._id,
          type: "new_booking",
          message: `New booking from ${patientName}`,
          patientName,
          serviceType: service,
          totalAmount,
          date,
        });
      }
    } catch (err) {}

    res.status(200).json({ success: true, message: "Payment successful" });

    sendBookingConfirmationEmail({
      toEmail,
      patientName,
      caregiverName,
      service,
      date,
      duration,
      totalAmount,
      bookingId,
      method: method || "UPI",
      transactionId: transactionId || razorpay_payment_id,
    })
      .then(() => {})
      .catch((emailErr) => {});
  } else {
    res.status(400).json({ success: false, message: "Payment failed" });
  }
});

module.exports = router;
