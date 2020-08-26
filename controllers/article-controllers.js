const HttpError = require("../models/http-error-model");
const { v4: uuid41 } = require("uuid");
const { validationResult } = require("express-validator");
const Article = require("../models/article");
const User = require("../models/user");
const mongoose = require("mongoose");

// Get specific article by articleID
const getArticleByArticleID = async (req, res, next) => {
  const articleId = req.params.aid;
  let article;
  try {
    article = await Article.findById(articleId);
  } catch (err) {
    const error = new HttpError("Could not find article.", 500);
    return next(error);
  }

  // throwing error syntax cen be used only in synchronous tasks
  if (!article) {
    const error = new HttpError(
      "Could not find an article for provided article ID.",
      404
    );
    return next(error);
  }

  res.json({ article: article.toObject({ getters: true }) });
};

// Get list of articles created by specific user/creator by creatorID
const getListOfArticlesByUserID = async (req, res, next) => {
  const userId = req.params.uid;
  let articles;
  try {
    articles = await Article.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Could not get list of articles for provided user ID.",
      500
    );
    return next(error);
  }
  // return next(error) syntax is used with asynchronous tasks
  if (!articles || articles.length === 0) {
    return next(
      new HttpError("Could not find an articles for provided user ID.", 404)
    );
  }
  res.json({
    articles: articles.map((article) => article.toObject({ getters: true })),
  });
};

// Create a new article
const createNewArticle = async (req, res, next) => {
  //Using validationResults(req) method of express-validator for validating inputs provided by user
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      new HttpError("Invalid input data passed, please check your data.", 422)
    );
  }
  // extracting data from incoming request
  const { creator, title, description, text } = req.body;
  // creating newArticle object with data from request
  const newArticle = new Article({
    creator: creator,
    title: title,
    imageUrl:
      "https://s3-torquehhvm-wpengine.netdna-ssl.com/uploads/2016/01/learn-javascript-for-wordpress-1-e1453745365916-1-e1453745455742.jpg",
    description: description,
    text: text,
  });

  //Checking if user exists
  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating new article failed, please try agian.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("User with provided ID does not exist.", 404);
    return next(error);
  }

  console.log(user);
  // Storing documnet in mongoDB
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newArticle.save({ session: sess });
    user.articles.push(newArticle);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  // response from server
  // 201 - code for something NEW succsessfully created on server
  res.status(201).json({ article: newArticle });
};

// Updating existing article
const updateExistingArticleById = async (req, res, next) => {
  //Using validationResults(req) method of express-validator for validating inputs provided by user
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      new HttpError("Invalid input data passed, please check your data.", 422)
    );
  }
  // Getting data that can be updated from request
  const { title, description, text } = req.body;
  const articleId = req.params.aid;

  //Getting article for updating from database
  let articleToUpdate;
  try {
    articleToUpdate = await Article.findById(articleId);
  } catch (err) {
    const error = new HttpError("Could not update article.", 500);
    return next(error);
  }

  // Updating/changing values
  articleToUpdate.title = title;
  articleToUpdate.description = description;
  articleToUpdate.text = text;

  //Saving updated article/values into database
  try {
    await articleToUpdate.save();
  } catch (err) {
    const error = new HttpError(
      "Updateing article failed, please try again.",
      500
    );
    return next(error);
  }

  //response
  res
    .status(200)
    .json({ article: articleToUpdate.toObject({ getters: true }) });
};

// Deleting article
const deleteArticle = async (req, res, next) => {
  //Extracting ID from URL
  const articleId = req.params.aid;

  let articleToDelete;
  try {
    articleToDelete = await Article.findById(articleId).populate("creator");
  } catch (err) {
    const error = new HttpError("Could not delete article.", 500);
    return next(error);
  }

  if (!articleToDelete) {
    const error = new HttpError("Could not find article for provided ID", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await articleToDelete.remove({ session: sess });
    articleToDelete.creator.articles.pull(articleToDelete);
    await articleToDelete.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete article.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Article has been deleted." });
};

exports.getArticleByArticleID = getArticleByArticleID;
exports.getListOfArticlesByUserID = getListOfArticlesByUserID;
exports.createNewArticle = createNewArticle;
exports.updateExistingArticleById = updateExistingArticleById;
exports.deleteArticle = deleteArticle;
