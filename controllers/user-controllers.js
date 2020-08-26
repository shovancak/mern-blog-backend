const HttpError = require("../models/http-error-model");
const { validationResult } = require("express-validator");
const User = require("../models/user");

// Getting list of all registrated users
const getListOfAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // return User object without password
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, can not get users, please try again.",
      500
    );
    return next(err);
  }
  if (!users || users.length === 0) {
    return next(new HttpError("Could not find any users.", 404));
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
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
  const { name, email, password, imageUrl } = req.body;

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
    imageUrl: imageUrl,
    articles: [],
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
