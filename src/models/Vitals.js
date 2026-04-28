const mongoose = require("mongoose");

const VitalsSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bloodPressure:{
    type: String,
    required: true
  },
  heartRate:{
    type: String,
    required: true
  },
  bloodSugar:{
    type: String,
    required: true
  },
  spO2:{
    type: String,
    required: true
  },
  recordedAt:{
    type: Date,
    default: Date.now
  }
},{timestamps: true});

module.exports = mongoose.model("Vitals", VitalsSchema);