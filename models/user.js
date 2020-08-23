const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniquevalidator = require("mongoose-unique-validator");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  articles: { type: String, required: true },
});

userSchema.plugin(uniquevalidator);

module.exports = mongoose.model("User", userSchema);
