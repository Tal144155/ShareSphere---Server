//using express module to create server
const express = require("express");

//creating the app
var server = express();

//using body parser and sending answeres as json
const bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

//showing files from public directory
server.use(express.static("public"));

//using the cors
const cors = require("cors");
server.use(cors());

//using mongoose on server
const mongoose = require("mongoose");

//creating the custom env
const customENV = require("custom-env");

//connecting to env wanted
customENV.env(process.env.NODE_ENV, "./config");

//connecting to mongoDB
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//connecting to router
const friends = require('./routes/friend');
server.use("/api/users/:id/friends", friends);

const users = require("./routes/user");
server.use("/api/users", users);

const tokensRouter = require('./routes/token')
server.use('/api/tokens', tokensRouter)

//port listening to
server.listen(process.env.PORT);
