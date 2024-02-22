const express = require('express')

const jwt = require("jsonwebtoken")
const key = "keypassphrase"

const userInfo = (req, res) => {
    res.json({ user })
}

// Generate a token
function getToken(req) {
    const data = { username: req.body.username }
    // Generate the token.
    const token = jwt.sign(data, key)
    // Return the token to the browser
    return token
}

// Ensure the user sent a valid token
function isLoggedIn(req, res, next) {
    // If the request has an authorization header
    if (req.headers.authorization) {
        // Extract the token from that header
        const token = req.headers.authorization.split(" ")[1];
        try {
            // Verify the token is valid
            const data = jwt.verify(token, key);
            // remove this line
            console.log('The logged in user is: ' + data.username);
            // Token validation was successful. Continue to the actual function
            return next()
        } catch (err) {
            return res.status(401).json( { error: "Invalid Token" } );
        }
    }
    else
        return res.status(403).json( { error: 'Token required' } );
}

module.exports = {
    getToken,
    isLoggedIn
}