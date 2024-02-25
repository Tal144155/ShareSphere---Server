const postController = require('../controllers/post');
const postModel = require('../models/post');
const tokenModel = require("../models/token");

const express = require("express");
var router = express.Router();

router.route("/:pid")
    .patch(tokenModel.isLoggedIn, postController.editPost)
    .delete(tokenModel.isLoggedIn, postController.deletePost)

router.route("/")
    .post(tokenModel.isLoggedIn, postController.createPost)





