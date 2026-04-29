const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "family",
  },
  photo: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  notificationPreferences: {
    newMessages: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false },

    // for caregivers
    newClientRequests: { type: Boolean, default: true },
    scheduleReminders: { type: Boolean, default: true },

    // for family
    appointmentReminders: { type: Boolean, default: true },
    medicationReminders: { type: Boolean, default: true },
  },
});

userSchema.index({email:1 });
userSchema.index({role:1 });
userSchema.index({_id:1});
module.exports = mongoose.model("User", userSchema);
