const userController = require("../controllers/user");
const tokenModel = require("../models/token.js");
const postController = require("../controllers/post");
const commentController = require("../controllers/comment");
const likeController = require("../controllers/like.js");

const express = require("express");
var router = express.Router();

const friendController = require("../controllers/friend");
// friends api mapping

router
  .route("/:id/friends/:fid")
  .patch(tokenModel.isLoggedIn, friendController.approveFriendRequest)
  .delete(tokenModel.isLoggedIn, friendController.deleteFriend);

router
  .route("/:id/friends")
  .get(tokenModel.isLoggedIn, friendController.getFriends)
  .post(tokenModel.isLoggedIn, friendController.friendRequest);

router
  .route("/:id/friendsReq")
  .get(tokenModel.isLoggedIn, friendController.getFriendsRequest);

//comment api mapping

router
  .route("/:id/posts/:pid/comments/")
  .post(tokenModel.isLoggedIn, commentController.createComment)
  .get(tokenModel.isLoggedIn, commentController.getComments);

router
  .route("/:id/posts/:pid/comments/:cid")
  .patch(tokenModel.isLoggedIn, commentController.editComment)
  .delete(tokenModel.isLoggedIn, commentController.deleteComment);

//likes api mapping

router
  .route("/:id/posts/:pid/likes")
  .get(tokenModel.isLoggedIn, likeController.isLiked)
  .patch(tokenModel.isLoggedIn, likeController.like);

// posts api mapping

router
  .route("/:id/posts/:pid")
  .patch(tokenModel.isLoggedIn, postController.editPost)
  .delete(tokenModel.isLoggedIn, postController.deletePost);

router
  .route("/:id/posts")
  .get(tokenModel.isLoggedIn, postController.getUserPosts)
  .post(tokenModel.isLoggedIn, postController.createPost);

// users api mapping

router
  .route("/:id")
  .get(tokenModel.isLoggedIn, userController.getUser)
  .delete(tokenModel.isLoggedIn, userController.deleteUser)
  .patch(tokenModel.isLoggedIn, userController.updateUser);

router
  .route("/")
  .post(userController.createUser)
  .get(userController.doesExistUserName);

module.exports = router;
