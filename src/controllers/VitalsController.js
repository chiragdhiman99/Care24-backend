const Vitals = require("../models/Vitals");

const createVitals = async (req, res) => {
  try {
    const { userId, bloodPressure, heartRate, bloodSugar, spO2 } = req.body;
    const vitals = new Vitals({
      userId,
      bloodPressure,
      heartRate,
      bloodSugar,
      spO2,
    });
    await vitals.save();
    res.status(201).json(vitals);
  } catch (error) {
    console.error("Error creating vitals:", error);
    res.status(500).json({ error: "Failed to create vitals" });
  }
};
const getVitals = async (req, res) => {
  try {
    const vitals = await Vitals.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(vitals);
  } catch (error) {
    console.error("Error fetching vitals:", error);
    res.status(500).json({ error: "Failed to fetch vitals" });
  }
};


module.exports = { createVitals, getVitals };
