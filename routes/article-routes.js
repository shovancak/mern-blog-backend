const express = require("express");
const router = express.Router();
const articleControllers = require("../controllers/article-controllers");
const { check } = require("express-validator");

// Get specific article by articleID
router.get("/:aid", articleControllers.getArticleByArticleID);

// Get list of articles created by specific user/creator by creatorID
router.get("/user/:uid", articleControllers.getListOfArticlesByUserID);

// Create a new article
//Using check method of express-validator for validating inputs provided by user
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
    check("text").not().isEmpty(),
  ],
  articleControllers.createNewArticle
);

// Updating existing article
//Using check method of express-validator for validating inputs provided by user
router.patch(
  "/:aid",
  [
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
    check("text").not().isEmpty(),
  ],
  articleControllers.updateExistingArticleById
);

// Deleting article
router.delete("/:aid", articleControllers.deleteArticle);

module.exports = router;
