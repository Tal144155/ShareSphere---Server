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
        type: Int16Array,
        default: 0,
    },
    is_liked: {
        type: Bool,
        default: false,
    },
    publish_date: {
        type: Date,
        default: mongoose.now,
    }
})

module.exports = mongoose.model("Post", Post);