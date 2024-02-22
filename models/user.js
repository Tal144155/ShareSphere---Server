const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
  user_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", User);
