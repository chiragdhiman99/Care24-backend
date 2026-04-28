const mongoose = require("mongoose");

const HealthRecordsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    doctor: { type: String, default: "" },
    notes: { type: String, default: "" },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HealthRecords", HealthRecordsSchema);
