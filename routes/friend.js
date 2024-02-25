const express = require('express')
var router = express.Router()

const friendController = require('../controllers/friend')
const tokenModel = require('../models/token')

const friendController = require('../controllers/friend')
const tokenModel = require('../models/token')

router.route('/:fid')
    .patch(tokenModel.isLoggedIn, friendController.approveFriendRequest)
    .delete(tokenModel.isLoggedIn, friendController.deleteFriend)

router.route('/')
    .get(tokenModel.isLoggedIn, friendController.getFriends)
    .post(tokenModel.isLoggedIn, friendController.friendRequest)


module.exports = router;