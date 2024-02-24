const userService = require('../services/user.js')
const tokenModel = require('../models/token.js')

async function processLogin(req, res) {
    const user_name = req.body.username
    const password = req.body.password
    if (await userService.isSigned(user_name, password) == false) {
        res.status(404).json( { error: 'Invalid username and/or password' } )
    } else {
        res.status(201).json( { token: tokenModel.getToken(req) } )
    }
}

module.exports = { processLogin }