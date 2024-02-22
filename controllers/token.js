const loginModel = require('../models/login.js')
const tokenModel = require('../models/token.js')

function processLogin(req, res) {
    if (loginModel.isSigned(req) == false) {
        res.status(404).json( { error: 'Invalid username and/or password' } )
    } else {
        res.status(200).json( { token: tokenModel.getToken(req) } )
    }
}

module.exports = { processLogin }