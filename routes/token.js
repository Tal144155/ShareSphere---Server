const tokenController = require('../controllers/token.js')

const express = require('express')
var router = express.Router()

router.route('/').post(tokenController.processLogin)

module.exports = router