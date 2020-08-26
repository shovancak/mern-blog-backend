const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Article", articleSchema);
