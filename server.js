const express = require('express')
const bodyParser = require('body-parser')
const tokensRouter = require('./routes/token')
const cors = require('cors')

const customEnv = require('custom-env')
customEnv.env(process.env.NODE_ENV, './config')

const mongoose = require('mongoose')
mongoose.connect(process.env.CONNECTION_STRING, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

var server = express()
// Middleware to parse incoming request bodies
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json())
server.use(cors())

server.use(express.static('public'))

server.use('/api/tokens', tokensRouter)

server.listen(process.env.PORT)