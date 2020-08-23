const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const articleRoutes = require("./routes/article-routes");
const userRoutes = require("./routes/user-routes");
const HttpError = require("./models/http-error-model");
const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);

// middleware handling ONLY routes, which have not been handled before
// reached ONLY if we have some request, which didnt get response before
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

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

mongoose
  .connect(
    "mongodb+srv://samuel:83461834Sh@cluster0-eamri.mongodb.net/articles?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is runnig at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
