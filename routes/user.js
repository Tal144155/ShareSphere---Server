const userController = require("../controllers/user");
const tokenModel = require("../models/token");

const express = require("express");
var router = express.Router();


router.route("/:id")
  .get(tokenModel.isLoggedIn, userController.getUser)
  .delete(tokenModel.isLoggedIn, userController.deleteUser)
  .patch(tokenModel.isLoggedIn, userController.updateUser);

router.route("/").post(userController.createUser);

module.exports = router;

