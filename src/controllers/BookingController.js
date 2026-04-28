const Booking = require("../models/booking");
const Caregiver = require("../models/Caregiver");
const Notification = require("../models/Notifications");

const createBooking = async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      bookingId,
      caregiverId,
      caregiverName,
      patientName,
      patientAge,
      patientGender,
      address,
      notes,
      serviceType,
      date,
      duration,
      totalAmount,
      paymentMethod,
      transactionId,
      razorpayOrderId,
    } = req.body;
    const booking = new Booking({
      userId,
      userEmail,
      bookingId,
      caregiverId,
      caregiverName,
      patientName,
      patientAge,
      patientGender,
      address,
      notes,
      startTime: new Date(),
      serviceType,
      date,
      duration,
      totalAmount,
      paymentMethod,
      transactionId,
      razorpayOrderId,
    });
    await booking.save();
    await Caregiver.findByIdAndUpdate(caregiverId, {
      status: "booked",
      available: false,
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.find({ userId: id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

const getBookingsByCaregiverId = async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const bookings = await Booking.find({ caregiverId });
    if (!bookings) {
      return res
        .status(404)
        .json({ error: "No bookings found for this caregiver" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

const markallAsRead = async (req, res) => {
  try {
    const { caregiverId } = req.params;
    await Booking.updateMany({ caregiverId }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
};

const markallAsRead2 = async (req, res) => {
  try {
    const { userId } = req.params;
    await Booking.updateMany({ userId }, { isRead: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelledBy } = req.body || {};
    const io = req.app.get("io");

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await Caregiver.findByIdAndUpdate(booking.caregiverId, {
      status: "active",
      available: true,
    });

    if (cancelledBy === "caregiver") {
      await Notification.create({
        userId: booking.userId,
        type: "booking_cancelled",
        caregiverName: booking.caregiverName,
        serviceType: booking.serviceType,
        totalAmount: booking.totalAmount,
        message: "Your booking has been cancelled by the caregiver",
        isRead: false,
      });

      io.to(booking.userId.toString()).emit("bookingCancelled", {
        bookingId: booking._id,
        cancelledBy: "caregiver",
        message: "your booking has been cancelled by the caregiver",
        type: "booking_cancelled",
        caregiverName: booking.caregiverName,
        serviceType: booking.serviceType,
        totalAmount: booking.totalAmount,
        createdAt: new Date(),
      });
    } else {
      await Notification.create({
        userId: booking.caregiverId,
        type: "booking_cancelled",
        caregiverName: booking.caregiverName,
        patientName: booking.patientName,
        serviceType: booking.serviceType,
        totalAmount: booking.totalAmount,
        message: "You cancelled your booking",
        isRead: false,
      });

      io.to(booking.userId.toString()).emit("bookingCancelled", {
        cancelledBy: "patient",
        bookingId: booking._id,
        type: "booking_cancelled",
        caregiverName: booking.caregiverName,
        serviceType: booking.serviceType,
        totalAmount: booking.totalAmount,
        createdAt: new Date(),
        message: "You cancelled your booking",
      });

      io.to(booking.caregiverId.toString()).emit("bookingCancelled", {
        cancelledBy: "patient",
        bookingId: booking._id,
        type: "booking_cancelled",
        patientName: booking.patientName,
        serviceType: booking.serviceType,
        totalAmount: booking.totalAmount,
        createdAt: new Date(),
        message: "Booking cancelled by patient",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getBookingsByCaregiverId,
  markallAsRead,
  markallAsRead2,
  cancelBooking,
  getAllBookings,
};
