const userController = require("../controllers/user");
const tokenModel = require("../models/token.js");

const express = require("express");

var router = express.Router();

router.route("/").post(userController.createUser);

router.route("/:id").get(tokenModel.isLoggedIn, userController.getUser);

router.route("/:id").delete(tokenModel.isLoggedIn, userController.deleteUser);

router.route("/:id").patch(tokenModel.isLoggedIn, userController.updateUser);

module.exports = router;
