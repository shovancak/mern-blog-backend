const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user-controllers");
const { check } = require("express-validator");

// Getting list of all users
router.get("/", userControllers.getListOfAllUsers);
// Signing up new user
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("imageUrl").not().isEmpty(),
  ],
  userControllers.signupUser
);
// Logging in existing user
router.post("/login", userControllers.loginUser);

module.exports = router;
