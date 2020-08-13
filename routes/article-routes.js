const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("Get request in article");
  res.json({ message: "it works" });
});

module.exports = router;
