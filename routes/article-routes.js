const express = require("express");
const router = express.Router();
const HttpError = require("../models/http-error-model");
const articleControllers = require("../controllers/article-controllers");

// Get specific article by articleID
router.get("/:aid", articleControllers.getArticleByArticleID);

// Get list of articles created by specific user/creator by creatorID
router.get("/user/:uid", articleControllers.getListOfArticlesByUserID);

// Create a new article
router.post("/", articleControllers.createNewArticle);

// Updating existing article
router.patch("/:aid", articleControllers.updateExistingArticleById);

// Deleting article
router.delete("/:aid", articleControllers.deleteArticle);

module.exports = router;
