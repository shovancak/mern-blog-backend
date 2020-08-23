const HttpError = require("../models/http-error-model");
const { v4: uuid41 } = require("uuid");
const { validationResult } = require("express-validator");
const Article = require("../models/article");

let DUMMY_ARTICLES = [
  {
    id: "a1",
    creator: "u1",
    title: "MERN Stack",
    imageUrl: "https://i.morioh.com/67feeaf72f.png",
    description:
      "One of the most popular technology stacks in web development.",
    text:
      "MERN Stack is a Javascript Stack that is used for easier and faster deployment of full-stack web applications. MERN Stack comprises of 4 technologies namely: MongoDB, Express, React and Node.js. It is designed to make the development process smoother and easier.",
  },
  {
    id: "a2",
    creator: "u2",
    title: "React",
    imageUrl: "https://probella.com/wp-content/uploads/2018/03/React-JS.png",
    description:
      "React JS is a JavaScript library used in web development to build interactive elements on websites.",
    text:
      "React is a JavaScript library that specializes in helping developers build user interfaces, or UIs.In terms of websites and web applications, UIs are the collection of on- screen menus, search bars, buttons, and anything else someone interacts with to USE a website or app.",
  },
  {
    id: "a3",
    creator: "u1",
    title: "NodeJs",
    imageUrl: "https://miro.medium.com/proxy/1*q9ww_u32hhpMaA-Q_s1ujw.png",
    description:
      "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
    text:
      "Node.js is a free, open-sourced, cross-platform JavaScript run-time environment that lets developers write command line tools and server-side scripts outside of a browser.",
  },
];

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
  // Storing documnet in mongoDB
  try {
    await newArticle.save();
  } catch (err) {
    const error = new HttpError(
      "Creating article failed, please try again.",
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

  let placeToDelete;
  try {
    placeToDelete = await Article.findByIdAndDelete(articleId);
  } catch (err) {
    const error = new HttpError("Could not delete article.", 500);
    return next(error);
  }
  res.status(200).json({ message: "Article has been deleted." });
};

exports.getArticleByArticleID = getArticleByArticleID;
exports.getListOfArticlesByUserID = getListOfArticlesByUserID;
exports.createNewArticle = createNewArticle;
exports.updateExistingArticleById = updateExistingArticleById;
exports.deleteArticle = deleteArticle;
