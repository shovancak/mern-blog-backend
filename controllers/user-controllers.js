const HttpError = require("../models/http-error-model");
const { v4: uuid41 } = require("uuid");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Samuel",
    email: "first@gmail.com",
    password: "first1",
  },
  {
    id: "u2",
    name: "Max",
    email: "second@gmail.com",
    password: "second2",
  },
  {
    id: "u3",
    name: "Oliver",
    email: "third@gmail.com",
    password: "third3",
  },
  {
    id: "u4",
    name: "Andrei",
    email: "fourth@gmail.com",
    password: "fourth4",
  },
  {
    id: "u5",
    name: "Yhua",
    email: "fifth@gmail.com",
    password: "fifth5",
  },
];

// Getting list of all registrated users
const getListOfAllUsers = (req, res, next) => {
  const users = [];
  DUMMY_USERS.map((user) => {
    return users.push(user);
  });
  if (!users || users.length === 0) {
    return next(new HttpError("Could not find any users.", 404));
  }
  res.status(200).json({ users: users });
};

// Signing up new user
const signupUser = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new HttpError("All credentials are needed.", 404));
  }
  const existingUser = DUMMY_USERS.find((user) => {
    return user.email === email;
  });
  if (existingUser) {
    return next(new HttpError("User with provided email already exists.", 422));
  }
  const newUser = {
    id: uuid41(),
    name: name,
    email: email,
    password: password,
  };
  DUMMY_USERS.push(newUser);
  res
    .status(201)
    .json({ message: "New user successfully Sign Up.", user: newUser });
};

// Loging in existing user
const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((user) => {
    if (user.email === email) {
      return user;
    }
  });
  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("Wrong credentials, please try again.", 404));
  }
  res.status(200).json({ message: "User successfully logged in." });
};

exports.getListOfAllUsers = getListOfAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
