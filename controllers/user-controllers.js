const HttpError = require("../models/http-error-model");
const { v4: uuid41 } = require("uuid");
const { validationResult } = require("express-validator");
const User = require("../models/user");

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
const signupUser = async (req, res, next) => {
  //Using validationResult(req) method of express-validator for validating inputs provided by user
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return next(
      new HttpError("Invalid input data passed, please check your data.", 422)
    );
  }
  const { name, email, password, articles } = req.body;

  //Checking if users email (user) exist already in database
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    error = new HttpError("Creating user failed, please try again.", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User already exists.", 422);
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    password,
    imageUrl: "https://i.imgur.com/DcylgJM.jpg",
    articles,
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({
    user: newUser.toObject({ getters: true }),
  });
};

// Loging in existing user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.", 500);
    return next(error);
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("Wrong credentials, please try again.", 401));
  }
  res.status(200).json({ message: "User successfully logged in." });
};

exports.getListOfAllUsers = getListOfAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
