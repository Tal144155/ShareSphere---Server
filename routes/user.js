const userController = require("../controllers/user");

const express = require("express");

var router = express.Router();

router.route("/").post(userController.createUser);

router.route("/:id").get(userController.getUser);

module.exports = router;
