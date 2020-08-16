const express = require("express");
const router = express.Router();

const DUMMY_ARTICLES = [
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
router.get("/:aid", (req, res, next) => {
  const articleId = req.params.aid;
  const article = DUMMY_ARTICLES.find((art) => {
    return art.id === articleId;
  });
  res.json({ article: article });
});

// Get list of articles created by specific user/creator by creatorID
router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const articles = [];
  DUMMY_ARTICLES.map((art) => {
    if (art.creator === userId) {
      return articles.push(art);
    }
  });
  res.json({ articles: articles });
});
module.exports = router;
