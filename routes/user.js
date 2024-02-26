const userController = require("../controllers/user");
const friendController = require('../controllers/friend');
const postController = require('../controllers/post');
const tokenModel = require("../models/token");

const express = require("express");
var router = express.Router();

// friends api mapping

router.route('/:id/friends/:fid')
    .patch(tokenModel.isLoggedIn, friendController.approveFriendRequest)
    .delete(tokenModel.isLoggedIn, friendController.deleteFriend)

router.route('/:id/friends')
    .get(tokenModel.isLoggedIn, friendController.getFriends)
    .post(tokenModel.isLoggedIn, friendController.friendRequest)

// posts api mapping

router.route("/:id/posts/:pid")
    .patch(tokenModel.isLoggedIn, postController.editPost)
    .delete(tokenModel.isLoggedIn, postController.deletePost)

router.route("/:id/posts")
    .get(tokenModel.isLoggedIn, postController.getUserPosts)
    .post(tokenModel.isLoggedIn, postController.createPost)

// users api mapping

router.route("/:id")
  .get(tokenModel.isLoggedIn, userController.getUser)
  .delete(tokenModel.isLoggedIn, userController.deleteUser)
  .patch(tokenModel.isLoggedIn, userController.updateUser);

router.route("/").post(userController.createUser);

module.exports = router;

