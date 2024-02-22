//using express module to create server
const express = require("express");

//creating the app
var app = express();

//using body parser and sending answeres as json
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

//showing files from public directory
app.use(express.static("public"));

//using the cors
const cors = require("cors");
app.use(cors());

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
const users = require("./routes/user");
app.use("/api", users);

//port listening to
app.listen(process.env.PORT);
