const userController = require("../controllers/user");

const express = require("express");

var router = express.Router();

router.route("/users").post(userController.createUser);

module.exports = router;
