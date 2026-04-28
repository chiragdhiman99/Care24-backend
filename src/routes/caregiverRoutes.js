const express = require("express");
const router = express.Router();

const {
  getCaregivers,
  getCaregiverbyId,
  updateCaregiverStatus,
  updateCaregiverProfile
} = require("../controllers/caregiverController");

router.get("/", getCaregivers);
router.get("/:id", getCaregiverbyId);
router.put("/:id", updateCaregiverStatus); 
router.patch("/:id/profile", updateCaregiverProfile);


module.exports = router;
