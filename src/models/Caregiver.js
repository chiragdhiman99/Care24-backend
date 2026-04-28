const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const caregiverSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    image: String,
    phone: {
      type: String,
      required: true,
    },
    email: String,
    city: String,
    experience: {
      type: Number,
      required: true,
    },

    bio: {
      type: String,
      maxLength: 500,
    },
    specializations: [String],
    languages: [String],

    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],

    certifications: [String],

    workHistory: [
      {
        organization: String,
        position: String,
        duration: String,
        startDate: Date,
        endDate: Date,
      },
    ],

    hourlyRate: {
      type: Number,
      required: true,
    },
    dailyRate: {
      type: Number,
      required: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    workingShifts: {
      morning: {
        available: { type: Boolean, default: true },
        timeRange: { type: String, default: "6 AM - 12 PM" },
      },
      afternoon: {
        available: { type: Boolean, default: true },
        timeRange: { type: String, default: "12 PM - 6 PM" },
      },
      evening: {
        available: { type: Boolean, default: false },
        timeRange: { type: String, default: "6 PM - 12 AM" },
      },
      night: {
        available: { type: Boolean, default: false },
        timeRange: { type: String, default: "12 AM - 6 AM" },
      },
    },

    emergencyAvailable: {
      type: Boolean,
      default: false,
    },

    serviceAreas: [String],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verificationDetails: {
      aadhaar: {
        url: { type: String, default: "" },
        verified: { type: Boolean, default: false },
      },
      policeClearance: {
        url: { type: String, default: "" },
        verified: { type: Boolean, default: false },
      },
      nursingCertificate: {
        url: { type: String, default: "" },
        verified: { type: Boolean, default: false },
      },
    },

    documents: [
      {
        type: {
          type: String,
          enum: [
            "aadhaar",
            "education",
            "certification",
            "police_verification",
            "other",
          ],
        },
        url: String,
        verified: {
          type: Boolean,
          default: false,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    ratingBreakdown: {
      fiveStar: { type: Number, default: 0 },
      fourStar: { type: Number, default: 0 },
      threeStar: { type: Number, default: 0 },
      twoStar: { type: Number, default: 0 },
      oneStar: { type: Number, default: 0 },
    },

    performanceMetrics: {
      successRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      averageResponseTime: {
        type: String,
        default: "2 hours",
      },
      casesCompleted: {
        type: Number,
        default: 0,
      },
      repeatBookings: {
        type: Number,
        default: 0,
      },
    },

    bookedDates: [
      {
        date: Date,
        timeSlot: {
          type: String,
          enum: ["morning", "afternoon", "evening", "night", "full_day"],
        },
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Booking",
        },
      },
    ],

    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "active", "suspended", "rejected"],
      default: "pending",
    },
    RejectionReason: {
      type: String,
      default: "",
    },

    profileViews: {
      type: Number,
      default: 0,
    },
    topRated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

caregiverSchema.index({ available: 1 });
caregiverSchema.index({ city: 1 });
caregiverSchema.index({ verificationStatus: 1 });
caregiverSchema.index({ rating: -1 });
caregiverSchema.index({ available: 1, city: 1 });

module.exports = mongoose.model("Caregiver", caregiverSchema);
