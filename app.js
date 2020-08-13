const express = require("express");
const bodyParser = require("body-parser");
const articleRoutes = require("./routes/article-routes");
const app = express();
const PORT = 5000;

app.use(articleRoutes);

app.listen(PORT, () => {
  console.log(`Server is runnig at port: ${PORT}`);
});
