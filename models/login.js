const express = require('express')
const app = express()


// Handle login form submission
function isSigned(req) {
    // Check credentials

    // TODO: change to actual checking the database

    if (req.body.username == 'guest' && req.body.password == '123456')
        return true
    else
        // Incorrect username/password. The user should try again.
        return false
}


module.exports = { isSigned }