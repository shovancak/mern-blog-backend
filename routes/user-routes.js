const express = require("express");
const router = express.Router();
const HttpError = require("../models/http-error-model");
const userControllers = require("../controllers/user-controllers");

router.get("/", userControllers.getListOfAllUsers);

module.exports = router;
