const HttpError = require("../models/http-error-model");
const { v4: uuid41 } = require("uuid");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Samuel",
    image: "https://i.imgur.com/DcylgJM.jpg",
    articleId: 11,
    amount: 2,
  },
  {
    id: "u2",
    name: "Max",
    image: "https://i.imgur.com/DcylgJM.jpg",
    articleId: 22,
    amount: 1,
  },
  {
    id: "u3",
    name: "Oliver",
    image: "https://i.imgur.com/DcylgJM.jpg",
    articleId: 33,
    amount: 1,
  },
  {
    id: "u4",
    name: "Andrei",
    image: "https://i.imgur.com/DcylgJM.jpg",
    articleId: 44,
    amount: 3,
  },
  {
    id: "u5",
    name: "Yhua",
    image: "https://i.imgur.com/DcylgJM.jpg",
    articleId: 55,
    amount: 4,
  },
];

// Getting list of all registrated users
const getListOfAllUsers = (req, res, next) => {
  const users = [];
  DUMMY_USERS.map((user) => {
    if (user.id) {
      return users.push(user);
    }
  });
  if (!users || users.length === 0) {
    return next(new HttpError("Could not find any users.", 404));
  }
  res.status(200).json({ users: users });
};

exports.getListOfAllUsers = getListOfAllUsers;
