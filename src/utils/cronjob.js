const cron = require("node-cron");
const Booking = require("../models/booking");
const Caregiver = require("../models/Caregiver");
const { getIO } = require("./socket");
const Notifications = require("../models/Notifications");
const User = require("../models/User");

const startCron = async () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const activebookings = await Booking.find({
        status: "confirmed",
        caregiverAvailable: true,
      });

      for (const booking of activebookings) {
        const bookingDate = new Date(booking.startTime);
        let durationms = 0;
        if (booking.duration.includes("mins")) {
          const mins = parseFloat(booking.duration.replace("mins", "").trim());
          durationms = mins * 60 * 1000;
        } else if (booking.duration.includes("hrs")) {
          const hrs = parseFloat(booking.duration.replace("hrs", "").trim());
          durationms = hrs * 60 * 60 * 1000;
        } else if (booking.duration.includes("Day")) {
          durationms = 24 * 60 * 60 * 1000;
        } else if (booking.duration.includes("Week")) {
          durationms = 7 * 24 * 60 * 60 * 1000;
        }

        const bookingend = new Date(bookingDate.getTime() + durationms);

        const appointmentTime = new Date(booking.startTime);
        const onehourbefore = new Date(
          appointmentTime.getTime() - 60 * 60 * 1000,
        );

        const user = await User.findById(booking.userId);

        if (
          now >= onehourbefore &&
          !booking.reminderSent &&
          user?.notificationPreferences.appointmentReminders === true
        ) {
          await Booking.findByIdAndUpdate(booking._id, { reminderSent: true });

          await Notifications.create({
            userId: booking.userId,
            bookingId: booking._id,
            type: "reminder",
            message: "Your caregiver is arriving in 1 hour!",
            caregiverName: booking.caregiverName,
            serviceType: booking.serviceType,
            totalAmount: booking.totalAmount,
          });

          const io = getIO();
          io.to(booking.userId.toString()).emit("appointmentReminder", {
            type: "reminder",
            message: "Your caregiver is arriving in 1 hour!",
            caregiverName: booking.caregiverName,
            serviceType: booking.serviceType,
            totalAmount: booking.totalAmount,
            createdAt: new Date(),
            isRead: false,
          });
        }

        if (now >= bookingend) {
          await Booking.findByIdAndUpdate(booking._id, { status: "completed" });
          await Caregiver.findByIdAndUpdate(booking.caregiverId, {
            status: "active",
            available: true,
          });
        }
      }
    } catch (err) {}
  });
};

module.exports = startCron;
