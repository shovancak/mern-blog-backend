const HttpError = require("../models/http-error-model");
const { v4: uuid41 } = require("uuid");
const { validationResult } = require("express-validator");

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
const getArticleByArticleID = (req, res, next) => {
  const articleId = req.params.aid;
  const article = DUMMY_ARTICLES.find((art) => {
    return art.id === articleId;
  });
  // throwing error syntax cen be used only in synchronous tasks
  if (!article) {
    throw new HttpError(
      "Could not find an article for provided article ID.",
      404
    );
  }

  res.json({ article: article });
};

// Get list of articles created by specific user/creator by creatorID
const getListOfArticlesByUserID = (req, res, next) => {
  const userId = req.params.uid;
  let articles = [];
  DUMMY_ARTICLES.map((art) => {
    if (art.creator === userId) {
      return articles.push(art);
    }
  });
  // return next(error) syntax is used with asynchronous tasks
  if (!articles || articles.length === 0) {
    return next(
      new HttpError("Could not find an articles for provided user ID.", 404)
    );
  }
  res.json({ articles: articles });
};

// Create a new article
const createNewArticle = (req, res, next) => {
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
  const newArticle = {
    id: uuid41(),
    creator: creator,
    title: title,
    description: description,
    text: text,
  };
  // addding new created article at the begining (.unshift) of articles array
  DUMMY_ARTICLES.unshift(newArticle);
  // response from server
  // 201 - code for something NEW succsessfully created on server
  res.status(201).json({ article: newArticle });
};

// Updating existing article
const updateExistingArticleById = (req, res, next) => {
  // Getting data that can be updated from request
  const { title, description, text } = req.body;
  const articleId = req.params.aid;
  // Spread operator will create copy of article we are going to update
  const articleToUpdate = {
    ...DUMMY_ARTICLES.find((article) => {
      return article.id === articleId;
    }),
  };
  //Finding index of article in array of DUMMY_ARTICLES
  const articleIndex = DUMMY_ARTICLES.findIndex((article) => {
    return article.id === articleId;
  });
  // Updating data of article in array with data from request
  articleToUpdate.title = title;
  articleToUpdate.description = description;
  articleToUpdate.text = text;
  // Replacing article in array be updated article
  DUMMY_ARTICLES[articleIndex] = articleToUpdate;

  res.status(200).json({ article: articleToUpdate });
};

// Deleting article
const deleteArticle = (req, res, next) => {
  //Extracting ID from URL
  const articleId = req.params.aid;
  // Returning new array of articles without article which ID doesnt matches ID passed by URL
  // If ID of article from URL matches ID of article in array, it will be filltered
  DUMMY_ARTICLES = DUMMY_ARTICLES.filter((article) => article.id !== articleId);
  res.status(200).json({ message: "Article has been deleted." });
};

exports.getArticleByArticleID = getArticleByArticleID;
exports.getListOfArticlesByUserID = getListOfArticlesByUserID;
exports.createNewArticle = createNewArticle;
exports.updateExistingArticleById = updateExistingArticleById;
exports.deleteArticle = deleteArticle;
