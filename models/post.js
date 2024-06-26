const mongoose = require("mongoose");
const { Bool, Date } = require("mongoose/lib/schema/index");

const Schema = mongoose.Schema;

const Post = new Schema({
  user_name: {
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
  profile: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  liked_by: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  publish_date: {
    type: Date,
    default: mongoose.now,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

module.exports = mongoose.model("Post", Post);
