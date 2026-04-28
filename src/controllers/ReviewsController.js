const Reviews = require("../models/Reviews");


const createReviews = async (req, res) => {
    try {
        const { userId, caregiverId, rating, feedback } = req.body;
        const review = new Reviews({
            userId,
            caregiverId,
            rating,
            feedback,
        });
        await review.save();
        res.status(200).json({ message: "Review created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create review" });
    }
} 

const getReviews = async (req, res) => {
    try {
        const reviews = await Reviews.find();
        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
}

module.exports = { createReviews , getReviews };