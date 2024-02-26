const postController = require('../controllers/post');
const tokenModel = require("../models/token");

const express = require("express");
var router = express.Router();

router.route("/")
    .get(tokenModel.isLoggedIn, postController.getFeed);


module.exports = router;



