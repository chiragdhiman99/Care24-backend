const express = require("express");
const router = express.Router();

const {healthrecords , gethealthrecords} = require("../controllers/HealthController");

router.post("/", healthrecords);
router.get("/:userId", gethealthrecords);

module.exports = router;