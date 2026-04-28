const express = require("express");
const router = express.Router();

const { createVitals, getVitals } = require("../controllers/VitalsController");

router.post("/", createVitals);
router.get("/:userId", getVitals);

module.exports = router;
