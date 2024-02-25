const userController = require("../controllers/user");
const tokenModel = require("../models/token.js");

const express = require("express");

var router = express.Router();

const friendController = require('../controllers/friend')
const tokenModel = require('../models/token')

router.route('/:id/friends/:fid')
    .patch(tokenModel.isLoggedIn, friendController.approveFriendRequest)
    .delete(tokenModel.isLoggedIn, friendController.deleteFriend)
    
router.route('/:id/friends')
    .get(tokenModel.isLoggedIn, friendController.getFriends)
    .post(tokenModel.isLoggedIn, friendController.friendRequest)

router.route("/").post(userController.createUser);

router
  .route("/:id")
  .get(tokenModel.isLoggedIn, userController.getUser)
  .delete(tokenModel.isLoggedIn, userController.deleteUser)
  .patch(tokenModel.isLoggedIn, userController.updateUser);

module.exports = router;

