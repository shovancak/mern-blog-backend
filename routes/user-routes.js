const express = require("express");
const router = express.Router();
const HttpError = require("../models/http-error-model");
const userControllers = require("../controllers/user-controllers");

// Getting list of all users
router.get("/", userControllers.getListOfAllUsers);
// Signing up new user
router.post("/signup", userControllers.signupUser);

module.exports = router;
