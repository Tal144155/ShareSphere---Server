const userController = require("../controllers/user");

const express = require("express");

var router = express.Router();

const friendController = require('../controllers/friend')
const tokenModel = require('../models/token')

router.route('/:id/friends/:fid')
    .patch(tokenModel.isLoggedIn, friendController.approveFriendRequest)
    
router.route('/:id/friends')
    .get(tokenModel.isLoggedIn, friendController.getFriends)
    .post(tokenModel.isLoggedIn, friendController.friendRequest)

router.route("/").post(userController.createUser);

module.exports = router;

//.delete(tokenModel.isLoggedIn, friendController.deleteFriend)
