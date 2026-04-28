const HealthRecords = require("../models/HealthRecords");

const healthrecords = async (req, res) => {
  try {
  
    const healthRecord = await HealthRecords.create({
      ...req.body,
      userId: req.body.userId,
    });
    res.status(201).json(healthRecord);
  } catch (error) {
    res.status(500).json({ error: "Failed to create health record" });
  }
};

const gethealthrecords = async (req, res) => {
  try {
    const healthRecords = await HealthRecords.find({ userId: req.params.userId });
    res.status(200).json(healthRecords);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch health records" });
  }
};

module.exports = { healthrecords , gethealthrecords};
