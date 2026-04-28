const UserQueries = require("../models/UserQueries");



const createUserQuery = async (req, res) => {
    try {
        const userQuery = await UserQueries.create(req.body);
        res.status(201).json(userQuery);
    } catch (error) {
        console.error("Error creating user query:", error);
        res.status(500).json({ error: "Failed to create user query" });
    }
};

module.exports = { createUserQuery };