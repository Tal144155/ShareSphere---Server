//using express module to create server
const express = require("express");

//creating the app
var server = express();

//using body parser and sending answeres as json
const bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
server.use(bodyParser.json({ limit: "50mb" }));
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
const posts = require("./routes/post");
server.use("/api/posts", posts);

const users = require("./routes/user");
server.use("/api/users", users);

const tokensRouter = require("./routes/token");
server.use("/api/tokens", tokensRouter);

//port listening to
server.listen(process.env.PORT);
