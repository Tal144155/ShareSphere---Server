const loginModel = require('../models/login.js')
const tokenModel = require('../models/token.js')

function processLogin(req, res) {
    if (loginModel.isSigned(req) == false) {
        res.status(404).send('Invalid username and/or password')
    } else {
        res.status(200).json(tokenModel.getToken(req))
    }
}

module.exports = { processLogin }