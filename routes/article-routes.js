const express = require("express");
const router = express.Router();
const HttpError = require("../models/http-error-model");
const articleControllers = require("../controllers/article-controllers");

// Get specific article by articleID
router.get("/:aid", articleControllers.getArticleByArticleID);

// Get list of articles created by specific user/creator by creatorID
router.get("/user/:uid", articleControllers.getListOfArticlesByUserID);

module.exports = router;
