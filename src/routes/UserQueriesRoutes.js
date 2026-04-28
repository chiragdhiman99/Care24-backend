const express = require("express");
const router = express.Router();


const {createUserQuery} = require("../controllers/UserQueriesController");

router.post("/", createUserQuery);

module.exports = router;