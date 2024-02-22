const express = require("express");

var app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const cors = require("cors");
app.use(cors());

const mongoose = require("mongoose");

const customENV = require("custom-env");

customENV.env(process.env.NODE_ENV, "./config");

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = require("./routes/user");
app.use("/api", users);

app.listen(process.env.PORT);
