const express = require("express");
const bodyParser = require("body-parser");
const articleRoutes = require("./routes/article-routes");
const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use("/api/articles", articleRoutes);

// default error handling middleware provided by Express
// executes when any middleware before has an error
app.use((error, req, res, next) => {
  //if response has been sent, return an error
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

app.listen(PORT, () => {
  console.log(`Server is runnig at port: ${PORT}`);
});
