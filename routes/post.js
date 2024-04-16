const postController = require("../controllers/post");
const tokenModel = require("../models/token");
const linkController = require("../controllers/links");

const express = require("express");
var router = express.Router();

//checking links mapping
router.route("/links").post(tokenModel.isLoggedIn, linkController.checkListUrl);

//get feed mapping
router.route("/").get(tokenModel.isLoggedIn, postController.getFeed);

module.exports = router;
