const commentController = require("../controllers/comment");

const express = require("express");

var router = express.Router();

router
  .route("/")
  .post(tokenModel.isLoggedIn, commentController.createComment)
  

