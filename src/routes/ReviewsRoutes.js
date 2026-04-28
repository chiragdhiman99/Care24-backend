const express = require("express");
const router = express.Router();

const { createReviews ,getReviews} = require("../controllers/ReviewsController");

router.post("/", createReviews);
router.get("/", getReviews);


module.exports = router;