const express = require("express");
const router = express.Router();
const {createBooking, getBookingById,getBookingsByCaregiverId,markallAsRead,markallAsRead2,cancelBooking,getAllBookings} = require("../controllers/BookingController");

router.post("/create", createBooking);
router.get("/get/:id", getBookingById);
router.get("/caregiver/:caregiverId", getBookingsByCaregiverId);
router.put("/read/caregiver/:caregiverId", markallAsRead);
router.put("/read/user/:userId", markallAsRead2);
router.patch("/:id/cancel", cancelBooking);
router.get("/all", getAllBookings);


module.exports = router;

