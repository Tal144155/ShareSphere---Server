const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
  user_name: {
    type: string,
    required: true,
  },
  password: {
    type: string,
    required: true,
  },
  first_name: {
    type: string,
    required: true,
  },
  last_name: {
    type: string,
    required: true,
  },
  pic: {
    type: string,
    required: true,
  },
});

module.exports = mongoose.model("User", User);
